'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import AddUserButton from '@/componentsRole/addUser';
import FilterButton from '@/componentsRole/filter';
import RoleAccessAccountRow, { RoleAccessAccount } from '@/componentsRole/roleAccessAccountRow';
import PaginationControls from '@/componentsRole/paginationControls';
import SearchField from '@/componentsRole/search-field';
import AddUserPopup from '@/componentsRole/addUser-popUp';
import DeletePopup from '@/componentsRole/delete-popUp';
import FilterDropdown from '@/componentsRole/filter-dropDown';
import UpdateUserPopup, { UpdateUserFormValues } from '@/componentsRole/updateUser-popUp';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5002';

const StyledAccountBoard = styled.section`
  width: 100%;

  .panel {
    width: 100%;
    max-width: 1106px;
    border-radius: 17px;
    background: #ffffff;
    padding: 28px 32px;
    box-shadow: 0 20px 40px rgba(15, 15, 15, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transform: translateX(14px);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 0 0 auto;
  }

  .panel-title h2 {
    font-size: 26px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .panel-subtitle {
    font-size: 16px;
    font-weight: 600;
    color: #6c6c6c;
    margin: 0;
  }

  .panel-controls {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1 1 520px;
    min-width: 360px;
    margin-left: auto;
    padding: 8px 12px;
    border-radius: 30px;
    position: relative;
  }

  .filter-control {
    position: relative;
    display: inline-flex;
  }

  .panel-body {
    min-height: 180px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .panel-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .panel-message {
    margin: 0;
    padding: 40px 0;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: #7c7c7c;
  }

  .panel-message--error {
    color: #df0404;
  }

  @media (max-width: 960px) {
    .panel {
      padding: 24px;
    }

    .panel-header {
      flex-direction: column;
      align-items: stretch;
    }

    .panel-controls {
      flex: 1 1 auto;
      min-width: 0;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
      margin-left: 0;
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    .panel-controls {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

type RoleAccessApiUser = {
  id: number;
  fname: string | null;
  lname: string | null;
  username: string | null;
  email: string | null;
  tel: string | null;
  role: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const dateTimeFormatter = new Intl.DateTimeFormat('th-TH', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function formatDateTime(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return dateTimeFormatter.format(date);
}

function mapApiUserToAccount(user: RoleAccessApiUser): RoleAccessAccount {
  const firstName = user.fname ?? '';
  const lastName = user.lname ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  const statusText = (user.status ?? 'Active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
  const lastLoginSource = user.updatedAt ?? user.createdAt;
  const normalizedRole = (user.role ?? '').toLowerCase();
  const roleValue = normalizedRole === 'sale' ? 'sales' : normalizedRole;
  const roleLabel = roleValue ? `${roleValue.charAt(0).toUpperCase()}${roleValue.slice(1)}` : 'Unknown';

  return {
    id: String(user.id),
    name: fullName || user.username || 'ไม่ทราบชื่อ',
    role: roleLabel,
    roleValue: roleValue || undefined,
    username: user.username ?? '',
    email: user.email ?? '',
    lastLogin: formatDateTime(lastLoginSource),
    status: statusText,
    firstName,
    lastName,
    phone: user.tel ?? '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export default function RoleAccessAccountBoard() {
  const [accounts, setAccounts] = useState<RoleAccessAccount[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<RoleAccessAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<RoleAccessAccount | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const rowsPerPage = 5;

  const existingEmails = useMemo(
    () =>
      accounts
        .map((account) => account.email.trim().toLowerCase())
        .filter((email) => email.length > 0),
    [accounts],
  );

  const existingUsers = useMemo(
    () =>
      accounts.map((account) => ({
        id: account.id,
        firstName: (account.firstName ?? '').trim(),
        lastName: (account.lastName ?? '').trim(),
        username: account.username.trim(),
      })),
    [accounts],
  );

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/role-access/users`, {
        credentials: 'include',
      });

      if (!response.ok) {
        let message = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (err) {
          // ignore json parse errors
        }
        throw new Error(message);
      }

      const data: RoleAccessApiUser[] = await response.json();
      setAccounts(data.map(mapApiUserToAccount));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedRole]);

  const filteredAccounts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return accounts.filter((account) => {
      if (query) {
        const haystack = `${account.name} ${account.username} ${account.email} ${account.role}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (selectedStatus) {
        if (account.status.toLowerCase() !== selectedStatus) {
          return false;
        }
      }

      if (selectedRole) {
        const roleToCompare = (account.roleValue ?? account.role).toLowerCase();
        if (roleToCompare !== selectedRole) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, searchTerm, selectedStatus, selectedRole]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / rowsPerPage));
  const paginatedAccounts = useMemo(
    () =>
      filteredAccounts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredAccounts, currentPage],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterSelect = (group: 'status' | 'role', rawValue: string) => {
    const value = rawValue.toLowerCase();

    if (group === 'status') {
      setSelectedStatus((prev) => (prev === value ? null : value));
    } else {
      const normalizedRole = value === 'sale' ? 'sales' : value;
      setSelectedRole((prev) => (prev === normalizedRole ? null : normalizedRole));
    }

    setIsFilterOpen(false);
  };

  const handleToggleStatus = async (
    account: RoleAccessAccount,
    nextStatus: RoleAccessAccount['status'],
  ) => {
    if (account.status === nextStatus) {
      return;
    }

    const previousStatus = account.status;

    setStatusUpdating((prev) => ({ ...prev, [account.id]: true }));
    setAccounts((prev) =>
      prev.map((item) =>
        item.id === account.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    );
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/role-access/users/${account.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        let message = 'ไม่สามารถอัปเดตสถานะผู้ใช้ได้';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (err) {
          // ignore json parse errors
        }
        throw new Error(message);
      }
    } catch (err) {
      setAccounts((prev) =>
        prev.map((item) =>
          item.id === account.id
            ? {
                ...item,
                status: previousStatus,
              }
            : item,
        ),
      );
      setError(
        err instanceof Error ? err.message : 'ไม่สามารถอัปเดตสถานะผู้ใช้ได้',
      );
    } finally {
      setStatusUpdating((prev) => {
        const next = { ...prev };
        delete next[account.id];
        return next;
      });
    }
  };

  const handleAddUserSubmit = async (formData: FormData) => {
    const firstName = (formData.get('firstName') as string | null)?.trim() ?? '';
    const lastName = (formData.get('lastName') as string | null)?.trim() ?? '';
    const username = (formData.get('username') as string | null)?.trim() ?? '';
    const email = (formData.get('email') as string | null)?.trim() ?? '';
    const phone = (formData.get('phone') as string | null)?.trim() ?? '';
    const role = (formData.get('role') as string | null)?.trim() ?? '';
    const password = (formData.get('password') as string | null) ?? '';

    if (!firstName || !lastName || !username || !email || !role || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const hasDuplicateEmail = accounts.some(
      (account) => account.email.trim().toLowerCase() === email.toLowerCase(),
    );

    if (hasDuplicateEmail) {
      setError('อีเมลนี้ถูกใช้แล้ว โปรดใช้อีเมลอื่น');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      const normalizedRole = role.toLowerCase();
      const response = await fetch(`${API_BASE_URL}/role-access/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fname: firstName,
          lname: lastName,
          username,
          email,
          tel: phone,
          role: normalizedRole === 'sale' ? 'sales' : normalizedRole,
          status: 'Active',
          password,
        }),
      });

      if (!response.ok) {
        let message = 'ไม่สามารถเพิ่มผู้ใช้ได้';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (err) {
          // ignore json parse errors
        }
        throw new Error(message);
      }

      await fetchAccounts();
      setIsAddUserOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateUserSubmit = async (values: UpdateUserFormValues) => {
    const normalizedEmail = values.email.trim().toLowerCase();
    const hasDuplicateEmail = accounts.some(
      (account) =>
        account.id !== values.id && account.email.trim().toLowerCase() === normalizedEmail,
    );

    if (hasDuplicateEmail) {
      setError('อีเมลนี้ถูกใช้แล้ว โปรดใช้อีเมลอื่น');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        fname: values.firstName,
        lname: values.lastName,
        username: values.username,
        email: values.email.trim(),
        tel: values.phone,
        status: values.status,
      };

      const normalizedRole = values.role.toLowerCase();
      payload.role = normalizedRole === 'sale' ? 'sales' : normalizedRole;

      if (values.password && values.password.trim().length > 0) {
        payload.password = values.password.trim();
      }

      const response = await fetch(`${API_BASE_URL}/role-access/users/${values.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = 'ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (err) {
          // ignore json parse errors
        }
        throw new Error(message);
      }

      await fetchAccounts();
      setIsUpdateOpen(false);
      setSelectedAccount(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestDeleteUser = (account: RoleAccessAccount) => {
    setAccountToDelete(account);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteOpen(false);
    setAccountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/role-access/users/${accountToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        let message = 'ไม่สามารถลบผู้ใช้ได้';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (err) {
          // ignore json parse errors
        }
        throw new Error(message);
      }

      await fetchAccounts();
      setIsDeleteOpen(false);
      setAccountToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบผู้ใช้');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenUpdate = (account: RoleAccessAccount) => {
    setSelectedAccount(account);
    setIsUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setIsUpdateOpen(false);
    setSelectedAccount(null);
  };

  return (
    <StyledAccountBoard>
      <DeletePopup
        open={isDeleteOpen}
        isDeleting={isDeleting}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title={accountToDelete ? `ลบบัญชี ${accountToDelete.name}?` : 'Delete Account?'}
      />
      <AddUserPopup
        open={isAddUserOpen}
        submitting={isAdding}
        onClose={() => setIsAddUserOpen(false)}
        onSubmit={handleAddUserSubmit}
        existingEmails={existingEmails}
        existingUsers={existingUsers}
      />
      <UpdateUserPopup
        open={isUpdateOpen}
        user={selectedAccount}
        submitting={isUpdating}
        onClose={handleCloseUpdate}
        onSubmit={handleUpdateUserSubmit}
        existingEmails={existingEmails}
        existingUsers={existingUsers}
      />
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Account</h2>
            <p className="panel-subtitle">ชื่อ - สกุล</p>
          </div>
          <div className="panel-controls">
            <SearchField
              id="role-access-search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="filter-control">
              <FilterButton
                aria-label="กรองและจัดเรียงบัญชีผู้ใช้"
                ref={filterButtonRef}
                onClick={() => setIsFilterOpen((prev) => !prev)}
              />
              <FilterDropdown
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onSelect={handleFilterSelect}
                anchorRef={filterButtonRef}
              />
            </div>
            <AddUserButton aria-label="เพิ่มบัญชีผู้ใช้" onClick={() => setIsAddUserOpen(true)} />
          </div>
        </div>
        <div className="panel-body">
          {error ? (
            <p className="panel-message panel-message--error">{error}</p>
          ) : isLoading ? (
            <p className="panel-message">กำลังโหลดข้อมูล...</p>
          ) : paginatedAccounts.length === 0 ? (
            <p className="panel-message">ไม่พบข้อมูลผู้ใช้</p>
          ) : (
            <ul className="panel-list">
              {paginatedAccounts.map((account) => (
                <RoleAccessAccountRow
                  key={account.id}
                  account={account}
                  onEdit={handleOpenUpdate}
                  onDelete={handleRequestDeleteUser}
                  onToggleStatus={handleToggleStatus}
                  isStatusUpdating={Boolean(statusUpdating[account.id])}
                />
              ))}
            </ul>
          )}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </StyledAccountBoard>
  );
}
