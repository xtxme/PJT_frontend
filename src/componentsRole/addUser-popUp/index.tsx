'use client';

import { FormEvent } from 'react';
import styled from 'styled-components';

type AddUserPopupProps = {
  open: boolean;
  submitting?: boolean;
  onClose?: () => void;
  onSubmit?: (formData: FormData) => void;
};

const StyledAddUserPopup = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  &.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 15, 15, 0.55);
    backdrop-filter: blur(2px);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .dialog {
    position: relative;
    z-index: 1;
    width: min(670px, calc(100vw - 32px));
    max-height: calc(100vh - 72px);
    border-radius: 32px;
    background: #ffffff;
    padding: 46px 48px 36px;
    box-shadow: 0 32px 70px rgba(15, 15, 15, 0.18);
    display: flex;
    flex-direction: column;
    gap: 28px;
    overflow: hidden;
  }

  .dialog-scroll {
    overflow-y: auto;
    padding-right: 8px;
    margin-right: -8px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    flex: 1;
  }

  .dialog-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .dialog-scroll::-webkit-scrollbar-thumb {
    background: rgba(15, 15, 15, 0.25);
    border-radius: 999px;
  }

  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #0f0f0f;
  }

  .dialog-header h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .dialog-header p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #7c7c7c;
  }

  .dialog-form {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 32px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 16px;
    font-weight: 600;
    color: #0f0f0f;
  }

  .form-input,
  .form-select {
    height: 52px;
    padding: 0 16px;
    border-radius: 16px;
    border: 1.4px solid #141414;
    background: #ffffff;
    font-size: 15px;
    color: #0f0f0f;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .form-input::placeholder {
    color: rgba(15, 15, 15, 0.45);
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #df7544;
    box-shadow: 0 0 0 3px rgba(223, 117, 68, 0.2);
  }

  .form-select {
    appearance: none;
    background-image: url('/images/dropdown-icon.svg');
    background-repeat: no-repeat;
    background-position: right 18px center;
    background-size: 16px;
    cursor: pointer;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 18px;
  }

  .dialog-button {
    min-width: 140px;
    height: 48px;
    border-radius: 16px;
    border: 1.4px solid #141414;
    background: #ffffff;
    color: #0f0f0f;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  }

  .dialog-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(15, 15, 15, 0.12);
  }

  .dialog-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 8px 14px rgba(15, 15, 15, 0.1);
  }

  .dialog-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .dialog-button.primary {
    border-color: #df7544;
    background: #df7544;
    color: #ffffff;
    box-shadow: 0 18px 36px rgba(223, 117, 68, 0.36);
  }

  .dialog-button.primary:hover:not(:disabled) {
    box-shadow: 0 20px 42px rgba(223, 117, 68, 0.42);
  }

  .dialog-button-icon {
    width: 12px;
    height: 12px;
  }

  @media (max-width: 920px) {
    .dialog {
      width: min(640px, calc(100vw - 24px));
    }
  }

  @media (max-width: 720px) {
    .dialog {
      border-radius: 24px;
      padding: 36px 26px 28px;
    }

    .form-grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .dialog-footer {
      flex-direction: column;
      gap: 12px;
    }

    .dialog-button {
      width: 100%;
    }
  }
`;

export default function AddUserPopup({ open, submitting = false, onClose, onSubmit }: AddUserPopupProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (onSubmit) {
      onSubmit(formData);
    } else {
      onClose?.();
    }
  };

  return (
    <StyledAddUserPopup className={open ? 'is-open' : ''} role="presentation">
      <button type="button" className="backdrop" aria-label="ปิดหน้าต่างเพิ่มผู้ใช้" onClick={onClose} />
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-scroll">
          <header className="dialog-header">
            <h3 id="add-user-popup-title">เพิ่มผู้ใช้ใหม่</h3>
            <p>กรอกข้อมูลผู้ใช้ใหม่และกำหนดสิทธิ์</p>
          </header>
          <form className="dialog-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span className="form-label">ชื่อ</span>
                <input className="form-input" name="firstName" placeholder="ชื่อ" required />
              </label>
              <label className="form-field">
                <span className="form-label">นามสกุล</span>
                <input className="form-input" name="lastName" placeholder="นามสกุล" required />
              </label>
              <label className="form-field">
                <span className="form-label">ชื่อผู้ใช้</span>
                <input className="form-input" name="username" placeholder="ชื่อผู้ใช้" required />
              </label>
              <label className="form-field">
                <span className="form-label">อีเมล</span>
                <input className="form-input" type="email" name="email" placeholder="อีเมล" required />
              </label>
              <label className="form-field">
                <span className="form-label">เบอร์โทร</span>
                <input className="form-input" name="phone" placeholder="เบอร์โทร" />
              </label>
              <label className="form-field">
                <span className="form-label">รหัสผ่าน</span>
                <input className="form-input" type="password" name="password" placeholder="รหัสผ่าน" required />
              </label>
              <label className="form-field">
                <span className="form-label">บทบาท</span>
                <select className="form-select" name="role" defaultValue="" required>
                  <option value="" disabled>
                    เลือกบทบาท
                  </option>
                  <option value="sales">พนักงานขาย</option>
                  <option value="owner">เจ้าของร้าน</option>
                  <option value="warehouse">พนักงานคลัง</option>
                </select>
              </label>
            </div>
            <footer className="dialog-footer">
              <button type="button" className="dialog-button" onClick={onClose} disabled={submitting}>
                ยกเลิก
                <img src="/images/cross-black.svg" alt="cross-black" />
              </button>
              <button type="submit" className="dialog-button primary" disabled={submitting}>
                เพิ่มผู้ใช้
                <img className="dialog-button-icon" src="/images/add-wh.svg" alt="add-white" />
              </button>
            </footer>
          </form>
        </div>
      </div>
    </StyledAddUserPopup>
  );
}
