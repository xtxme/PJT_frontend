'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AddUserButton from '@/componentsRole/addUser';
import FilterButton from '@/componentsRole/filter';
import RoleAccessAccountRow, { RoleAccessAccount } from '@/componentsRole/roleAccessAccountRow';
import PaginationControls from '@/componentsRole/paginationControls';
import SearchField from '@/componentsRole/search-field';
import AddUserPopup from '@/componentsRole/addUser-popUp';
import FilterDropdown from '@/componentsRole/filter-dropDown';

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

  .panel-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
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

const mockAccounts: RoleAccessAccount[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'owner',
    username: 'owner1',
    email: 'admin@company.com',
    lastLogin: '2024-06-15 09:30',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'sales',
    username: 'sales1',
    email: 'owner@company.com',
    lastLogin: '2024-06-15 08:15',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    role: 'warehouse',
    username: 'warehouse1',
    email: 'sales1@company.com',
    lastLogin: '2024-06-15 10:45',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Samantha Lee',
    role: 'finance',
    username: 'finance1',
    email: 'finance1@company.com',
    lastLogin: '2024-06-14 17:12',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Michael Brown',
    role: 'support',
    username: 'support1',
    email: 'support1@company.com',
    lastLogin: '2024-06-15 07:40',
    status: 'Inactive',
  },
  {
    id: '6',
    name: 'Emily Davis',
    role: 'marketing',
    username: 'marketing1',
    email: 'marketing1@company.com',
    lastLogin: '2024-06-13 19:05',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Robert Wilson',
    role: 'owner',
    username: 'owner2',
    email: 'owner2@company.com',
    lastLogin: '2024-06-14 11:25',
    status: 'Active',
  },
  {
    id: '8',
    name: 'Isabella Martinez',
    role: 'sales',
    username: 'sales2',
    email: 'sales2@company.com',
    lastLogin: '2024-06-12 16:12',
    status: 'Inactive',
  },
  {
    id: '9',
    name: 'Daniel Thompson',
    role: 'warehouse',
    username: 'warehouse2',
    email: 'warehouse2@company.com',
    lastLogin: '2024-06-15 06:55',
    status: 'Active',
  },
  {
    id: '10',
    name: 'Laura Garcia',
    role: 'support',
    username: 'support2',
    email: 'support2@company.com',
    lastLogin: '2024-06-13 13:30',
    status: 'Inactive',
  },
];

export default function RoleAccessAccountBoard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const rowsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(mockAccounts.length / rowsPerPage));
  const paginatedAccounts = mockAccounts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <StyledAccountBoard>
      <AddUserPopup open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Account</h2>
            <p className="panel-subtitle">ชื่อ - สกุล</p>
          </div>
          <div className="panel-controls">
            <SearchField id="role-access-search" placeholder="Search" />
            <div className="filter-control">
              <FilterButton
                aria-label="กรองและจัดเรียงบัญชีผู้ใช้"
                ref={filterButtonRef}
                onClick={() => setIsFilterOpen((prev) => !prev)}
              />
              <FilterDropdown
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                anchorRef={filterButtonRef}
              />
            </div>
            <AddUserButton aria-label="เพิ่มบัญชีผู้ใช้" onClick={() => setIsAddUserOpen(true)} />
          </div>
        </div>
        <ul className="panel-list">
          {paginatedAccounts.map((account) => (
            <RoleAccessAccountRow key={account.id} account={account} />
          ))}
        </ul>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </StyledAccountBoard>
  );
}
