// Custom slider component
export const Slider = ({ value, min, max, onChange, label }) => {
  return (
    <div className="custom-slider">
      <label>
        {label}: {value}
      </label>
      <div className="slider-container">
        <input 
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <div className="slider-value">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

// Custom button component
export const Button = ({ onClick, children }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
};