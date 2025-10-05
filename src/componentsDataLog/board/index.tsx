import styled from "styled-components"

const StyledDataBoard = styled.div`
    width: 100%;
    max-width: 1106px;
    height: 456px;
    border-radius: 24px;
    background: #ffffff;
    box-shadow: 0 0.5px 0.5px 0 rgba(0, 0, 0, 0.10);
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transform: translateX(14px);

    .header-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }

    .head-box-text{
        font-size: 26px;
        font-weight: 700;
    }
`

export default function DataLogBoard() {
    return (
        <StyledDataBoard>
            <div className="header-box">
                <div className="head-box-text">Activity Log</div>
            </div>
        </StyledDataBoard>
    )
    
}