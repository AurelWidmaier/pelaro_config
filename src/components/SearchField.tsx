import { useEffect, useRef, type KeyboardEvent } from 'react'
import styles from './SearchField.module.css'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Unsichtbare Beschriftung für Screenreader */
  label: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  /** Für Ergebnislisten mit Pfeiltasten-Navigation */
  listId?: string
  activeId?: string
  expanded?: boolean
}

/** Suchfeld mit Lupe, Löschen-Button und Tastenkürzel „/“ zum Fokussieren. */
export function SearchField({ value, onChange, placeholder, label, onKeyDown, listId, activeId, expanded }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onGlobalKey(e: globalThis.KeyboardEvent) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onGlobalKey)
    return () => window.removeEventListener('keydown', onGlobalKey)
  }, [])

  return (
    <div className={styles.wrap} role="search">
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        role={listId ? 'combobox' : undefined}
        aria-controls={listId}
        aria-expanded={listId ? Boolean(expanded) : undefined}
        aria-activedescendant={activeId}
        aria-autocomplete={listId ? 'list' : undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault()
            onChange('')
            return
          }
          onKeyDown?.(e)
        }}
      />
      {value ? (
        <button
          type="button"
          className={styles.clear}
          aria-label="Suche löschen"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : (
        <kbd className={styles.kbd} aria-hidden="true">
          /
        </kbd>
      )}
    </div>
  )
}

/** Hebt Teile eines Textes hervor (Ergebnis von highlight() aus lib/search). */
export function Highlighted({ parts }: { parts: { text: string; mark: boolean }[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.mark ? (
          <mark key={i} className={styles.mark}>
            {p.text}
          </mark>
        ) : (
          p.text
        ),
      )}
    </>
  )
}
