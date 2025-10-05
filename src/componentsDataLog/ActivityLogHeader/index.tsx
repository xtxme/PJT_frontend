import styled from "styled-components";

const StyledActivityLogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .title {
    font-size: 26px;
    font-weight: 700;
    color: #1d1e25;
  }

  .filter-button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-radius: 999px;
    border: none;
    background: #f2f2f6;
    color: #1d1e25;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .filter-button:hover {
    background: #e6e6f0;
  }

  .filter-button:active {
    background: #d9d9e6;
  }

  .filter-icon {
    width: 10px;
    height: 10px;
    position: relative;
  }

  .filter-icon::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 1px;
    width: 8px;
    height: 8px;
    border-left: 2px solid #1d1e25;
    border-bottom: 2px solid #1d1e25;
    transform: rotate(-45deg);
  }
`;

export default function ActivityLogHeader() {
  return (
    <StyledActivityLogHeader>
      <h2 className="title">Activity Log</h2>
      <button className="filter-button" type="button">
        <span>All</span>
        <span className="filter-icon" />
      </button>
    </StyledActivityLogHeader>
  );
}
