import React from 'react'

const Button53 = ({ text = "Button", link = "#", onClick, className = "" }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    if (link && link !== "#") {
      window.open(link, '_blank')
    }
  }

  // Split text into individual characters, preserving spaces
  const letters = text.split('')

  return (
    <div className={className}>
      <button 
        className="btn-53"
        onClick={handleClick}
      >
        <div className="original">{text}</div>
        <div className="letters">
          {letters.map((letter, index) => (
            <span key={index} className={letter === ' ' ? 'space' : ''}>
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>
      </button>
    </div>
  )
}

export default Button53;