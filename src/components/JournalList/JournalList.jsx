import './JournalList.css';
import CardButton from '../CardButton/CardButton.jsx';
import JournalItem from '../JournalItem/JournalItem.jsx';
import {useContext, useEffect} from 'react';
import {UserContext} from '../../context/user.context.jsx';
function JournalList({items, setItem}) {
	const {userId} = useContext(UserContext);
	if(items.length === 0) {
		return <p>Записей пока нет, добавьте первую</p>;
	}
	const sortData = (a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	};
	return (
		<>
			{items.filter(el => el.userId === userId).sort(sortData).map(el =>(
				<CardButton key={el.id} onClick={()=> setItem(el)}>
					<JournalItem
						title={el.title}
						date={el.date}
						text={el.post}
					/>
				</CardButton>
			))}
		</>);
}

export default JournalList;