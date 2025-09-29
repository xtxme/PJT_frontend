"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

interface DashButtonOption {
  value: string;
  label: string;
}

interface DashButtonProps {
  options?: DashButtonOption[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  transform: translateX(-10px);

  .period-toggle {
    display: flex;
    width: 120px;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    background-color: #df7544;
    box-shadow: 0 6px 16px rgba(223, 117, 68, 0.24);
  }

  .period-toggle:hover {
    box-shadow: 0 8px 20px rgba(223, 117, 68, 0.32);
  }

  .period-toggle:focus {
    outline: 2px solid rgba(223, 117, 68, 0.45);
    outline-offset: 2px;
  }

  .period-toggle:active {
    transform: translateY(1px);
  }

  .period-toggle-icon {
    display: flex;
    width: 22px;
    height: 22px;
  }

  .period-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 100%;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 12px 28px rgba(15, 15, 15, 0.12);
    overflow: hidden;
    padding: 6px 0;
    z-index: 10;
    list-style: none;
    margin: 0;
  }

  .period-option {
    width: 100%;
    padding: 12px 20px;
    text-align: left;
    background: transparent;
    border: none;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    color: #1f1f1f;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .period-option:hover {
    background: rgba(223, 117, 68, 0.1);
    color: #df7544;
  }

  .period-option.selected {
    background: #df7544;
    color: #ffffff;
    font-weight: 600;
  }
`;

const defaultOptions: DashButtonOption[] = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function DashButton({
  options,
  defaultValue,
  onSelect,
  className,
}: DashButtonProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const periodOptions = useMemo(
    () => (options && options.length > 0 ? options : defaultOptions),
    [options],
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    if (defaultValue) {
      return defaultValue;
    }
    return periodOptions[0]?.value ?? "";
  });
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  useEffect(() => {
    if (!periodOptions.some((option) => option.value === selectedPeriod)) {
      const fallbackValue = periodOptions[0]?.value ?? "";
      setSelectedPeriod(fallbackValue);
      onSelect?.(fallbackValue);
    }
  }, [periodOptions, selectedPeriod, onSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPeriodOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPeriodOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === selectedPeriod)?.label ??
    "";

  const handleSelectPeriod = (value: string) => {
    setSelectedPeriod(value);
    setIsPeriodOpen(false);
    onSelect?.(value);
  };

  if (!selectedPeriodLabel) {
    return null;
  }

  return (
    <Wrapper className={className} ref={dropdownRef}>
      <button
        type="button"
        className={`period-toggle${isPeriodOpen ? " open" : ""}`}
        onClick={() => setIsPeriodOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isPeriodOpen}
      >
        {selectedPeriodLabel}
        <Image
          className="period-toggle-icon"
          src={
            isPeriodOpen
              ? "/images/dropdown-up-or.svg"
              : "/images/dropdown-down-or.svg"
          }
          alt={isPeriodOpen ? "ปิดตัวเลือกช่วงเวลา" : "เปิดตัวเลือกช่วงเวลา"}
          width={16}
          height={16}
          priority={false}
        />
      </button>
      {isPeriodOpen && (
        <ul className="period-menu" role="listbox">
          {periodOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`period-option${
                  option.value === selectedPeriod ? " selected" : ""
                }`}
                onClick={() => handleSelectPeriod(option.value)}
                role="option"
                aria-selected={option.value === selectedPeriod}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
