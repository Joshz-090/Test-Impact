import React from 'react'

const Button = ({ text = "Button", link = "#", onClick, className = "" }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    if (link && link !== "#") {
      window.open(link, '_blank')
    }
  }

  return (
    <div className={className}>
      <button 
        className="btn-17"
        onClick={handleClick}
      >
        <span className="text-container">
          <span className="text">{text}</span>
        </span>
      </button>
    </div>
  )
}

export default Button 