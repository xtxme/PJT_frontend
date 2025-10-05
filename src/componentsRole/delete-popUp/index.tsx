'use client';

import styled from 'styled-components';

type DeletePopupProps = {
  open: boolean;
  isDeleting?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  losses?: string[];
};

const StyledDeletePopup = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1400;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  font-family: inherit;

  &.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(17, 21, 31, 0.82);
    backdrop-filter: blur(2px);
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .dialog {
    position: relative;
    z-index: 1;
    width: min(440px, calc(100vw - 32px));
    border-radius: 24px;
    background: #ffffff;
    padding: 62px 44px 40px;
    box-shadow: 0 48px 96px rgba(12, 16, 24, 0.35);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .dialog::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 14px;
    background: #ff4747;
    border-radius: 24px 24px 0 0;
  }

  .dialog-icon img {
    width: 100px;
    height: 100px;
    transform: translateX(125%);
    align-items: center;
    justify-content: center;
  }

  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 18px;
  }

  .dialog-header h3 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #1c1f2a;
    letter-spacing: 0.01em;
  }

  .dialog-header p {
    margin: 0;
    font-size: 17px;
    font-weight: 500;
    color: #515968;
    white-space: pre-line;
  }

  .loss-list li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    line-height: 1.45;
  }

  .loss-list li::before {
    content: '-';
    color: #ff3d46;
    font-weight: 700;
  }

  .actions {
    margin-top: 4px;
    display: flex;
    justify-content: center;
    gap: 18px;
  }

  .actions button {
    min-width: 168px;
    height: 54px;
    border-radius: 18px;
    border: 2px solid transparent;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  }

  .actions button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .cancel-button {
    background: #ffffff;
    color: #1c1f2a;
    border-color: #d7dbe4;
    box-shadow: 0 20px 36px rgba(17, 21, 31, 0.12);
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    
}

  .cancel-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 24px 44px rgba(17, 21, 31, 0.16);
  }

  .delete-button {
    background: #ff3d46;
    color: #ffffff;
    border-color: #ff3d46;
    box-shadow: 0 28px 52px rgba(255, 61, 70, 0.45);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .delete-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 32px 60px rgba(255, 61, 70, 0.55);
  }

  .delete-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 20px 44px rgba(255, 61, 70, 0.45);
  }

  @media (max-width: 540px) {
    .dialog {
      width: min(360px, calc(100vw - 24px));
      padding: 56px 28px 34px;
      gap: 22px;
    }

    .actions {
      flex-direction: column;
      gap: 12px;
    }

    .actions button {
      width: 100%;
    }

    .dialog-button {
    min-width: 120px;
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
    
  }
`;

const defaultLosses = ['profile', 'messages', 'photos'];

export default function DeletePopup({
  open,
  isDeleting = false,
  onClose,
  onConfirm,
  title = 'Delete Account?',
  description = "คุณกำลังจะลบบัญชีและข้อมูลทั้งหมด\nซึ่งไม่สามารถกู้คืนได้",
  losses = defaultLosses,
}: DeletePopupProps) {
  return (
    <StyledDeletePopup className={open ? 'is-open' : ''} role="presentation">
      <button
        type="button"
        className="backdrop"
        aria-label="ปิดหน้าต่างยืนยันการลบบัญชี"
        onClick={onClose}
      />
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-icon">
          <img src="/images/rubbish-bin-red.svg" alt="delete icon" width={100} height={100}/>
        </div>
        <header className="dialog-header">
          <h3 id="delete-popup-title">{title}</h3>
          <p>{description}</p>
        </header>
        <div className="actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
        disabled={isDeleting}
      >
        <span>ยกเลิก</span>
        <img src="/images/cross-black.svg" alt="cross-black" width={24} height={24} />
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <span>ลบบัญชีผู้ใช้</span>
            <img src="/images/check-wh.svg" alt="check-white" width={16} height={16} />
          </button>
        </div>
      </div>
    </StyledDeletePopup>
  );
}
