const StudentDisplay = ({students}) => {
    return (<div>
        {
            students.map((curStud, i) => {
                const {classno, rollno, name, email} = curStud;

                return (
                    <tr key={i}>
                        <td>{classno}</td>
                        <td>{rollno}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                    </tr>
                )
            })
        }
    </div>)
}

export default StudentDisplay;