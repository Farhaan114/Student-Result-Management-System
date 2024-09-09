export default function buttonBelowTitle(props){
    return (
        <button className="add-exam-btn" onClick={props.click}>{props.title} </button>
    )
};