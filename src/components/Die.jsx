export default function Die(props) {
  
  return (
    <button
      className={`die-button ${props.held ? "held" : ""} ${props.roll ? "roll" : ""}` } 
      style={{ animationDelay: `${props.delay || 0}ms` }}
      // ${props.roll ? "roll" : ""}
      aria-label={`Die with value ${props.value},
      ${props.held ? "held" : "hot held"}`}
      aria-pressed={props.held}
      onClick={props.handleClick}
    >
      {props.value}
    </button>
  );
}
