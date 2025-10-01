import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
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
    -webkit-appearance: none;
    appearance: none;
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
    width: 22px;
    height: 22px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:focus-within .cross {
    opacity: 1;
    pointer-events: auto;
  }

  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
  input[type="search"]::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
`;

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  className?: string;
};

export default function SearchField({ id, className, type = 'search', onChange, value, defaultValue, ...rest }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(
    (typeof value === 'string' && value.length > 0) ||
    (typeof defaultValue === 'string' && defaultValue.length > 0)
  );

  // sync สถานะ hasValue เมื่อเป็น controlled component
  useEffect(() => {
    if (typeof value === 'string') {
      setHasValue(value.length > 0);
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setHasValue(e.currentTarget.value.length > 0);
    rest.onInput?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.currentTarget.value.length > 0);
    onChange?.(e);
  };

  const handleClear = () => {
    const el = inputRef.current;
    if (!el) return;

    // กรณี controlled: แจ้งผู้ใช้ผ่าน onChange ให้เคลียร์ค่า
    if (typeof value !== 'undefined') {
      onChange?.({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    } else {
      // กรณี uncontrolled: แก้ค่าตรง ๆ
      el.value = '';
      setHasValue(false);
      // กระตุ้น event 'input' เผื่อมี listener ภายนอก
      const ev = new Event('input', { bubbles: true });
      el.dispatchEvent(ev);
    }

    el.focus();
  };
  
  return (
    <SearchFieldLabel
      htmlFor={id}
      className={className}
      data-has-value={hasValue ? 'true' : 'false'}
    >
      <img className="search-pic" src="/images/search.svg" alt="search" />
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onInput={handleInput}
        {...rest}
      />
      <button
        type="button"
        className="cross"
        onClick={handleClear}
        aria-label="Clear search"
        title="Clear"
      >
        <img className="cross" src="/images/cross-or.svg" alt="cross" />
      </button>
      
    </SearchFieldLabel>
  );
}
