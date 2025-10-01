import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const SearchFieldLabel = styled.label`
  display: flex;
  position: relative;
  align-items: center;
  gap: 12px;
  height: 38px;
  padding: 8px 12px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(223, 117, 68, 0.35);

  flex: 1 1 auto;
  width: 394px;
  min-width: 180px;
  border: 1px solid #df7544;

  .search-pic {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    color: #0f0f0f;
    outline: none;
    padding-right: 36px;
  }

  input::placeholder {
    color: #AFAFAF;
    font-size: 16px;
    font-weight: 400;
  }

  .cross{
    position: absolute;
    cursor: pointer;
    right: 12px;
    width: 18px;
    height: 18px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:focus-within .cross {
    opacity: 1;
    pointer-events: auto;
  }
`;

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  className?: string;
};

export default function SearchField({ id, className, type = 'search', ...rest }: SearchFieldProps) {
  return (
    <SearchFieldLabel htmlFor={id} className={className}>
      <img className="search-pic" src="/images/search.svg" alt="" />
      <input id={id} type={type} {...rest} />
      <img className="cross" src="/images/cross-or.svg" alt="" />
    </SearchFieldLabel>
  );
}

export { SearchFieldLabel };
