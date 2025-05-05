const Filter = ({ userIds, setUserId }) => {
    const handleChange = e => {
        const val = e.target.value;
        setUserId(val === '' ? null : Number(val));
    };

    return (
        <div>
            <label htmlFor="user-filter">Filter by user: </label>
            <select id="user-filter" onChange={handleChange}>
                <option value="">All posts</option>
                {userIds.map(id => (
                    <option key={id} value={id}>
                        User {id}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Filter;
