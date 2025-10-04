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
    background: rgba(10, 13, 20, 0.7);
    backdrop-filter: blur(2px);
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .dialog {
    position: relative;
    z-index: 1;
    width: min(420px, calc(100vw - 32px));
    border-radius: 28px;
    background: #ffffff;
    padding: 54px 40px 36px;
    box-shadow: 0 32px 70px rgba(9, 12, 18, 0.35);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .dialog::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    background: #ef3d46;
    border-radius: 28px 28px 0 0;
  }

  .dialog-icon {
    position: absolute;
    top: -42px;
    left: 50%;
    transform: translateX(-50%);
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: linear-gradient(180deg, #ff5d63 0%, #ef3d46 100%);
    border: 6px solid #1d212c;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18px 34px rgba(239, 61, 70, 0.55);
  }

  .dialog-icon img {
    width: 40px;
    height: 40px;
  }

  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .dialog-header h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #1d212c;
    letter-spacing: 0.01em;
  }

  .dialog-header p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #636b7c;
  }

  .loss-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #414958;
    font-size: 15px;
  }

  .loss-list li::before {
    content: '\u2022';
    color: #ef3d46;
    font-weight: 700;
    margin-right: 10px;
  }

  .loss-list li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .actions {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .actions button {
    min-width: 150px;
    height: 52px;
    border-radius: 18px;
    border: 1.6px solid transparent;
    font-size: 16px;
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
    color: #1d212c;
    border-color: #c6cad4;
    box-shadow: 0 10px 26px rgba(18, 21, 30, 0.08);
  }

  .cancel-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 16px 30px rgba(18, 21, 30, 0.12);
  }

  .delete-button {
    background: #ef3d46;
    color: #ffffff;
    border-color: #ef3d46;
    box-shadow: 0 20px 40px rgba(239, 61, 70, 0.45);
  }

  .delete-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 26px 48px rgba(239, 61, 70, 0.55);
  }

  .delete-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 16px 30px rgba(239, 61, 70, 0.45);
  }

  @media (max-width: 540px) {
    .dialog {
      width: min(360px, calc(100vw - 24px));
      padding: 48px 28px 30px;
    }

    .actions {
      flex-direction: column;
      gap: 12px;
    }

    .actions button {
      width: 100%;
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
  description = "You'll permanently lose your:",
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
          <img src="/images/rubbish-bin-red.svg" alt="delete icon" />
        </div>
        <header className="dialog-header">
          <h3 id="delete-popup-title">{title}</h3>
          <p>{description}</p>
        </header>
        {losses.length > 0 && (
          <ul className="loss-list">
            {losses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <div className="actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            Delete Account
          </button>
        </div>
      </div>
    </StyledDeletePopup>
  );
}
