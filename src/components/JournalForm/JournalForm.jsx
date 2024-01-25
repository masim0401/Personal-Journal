import styles from './JournalForm.module.css';
import {useContext, useEffect, useReducer, useRef} from 'react';
import Button from '../Button/Button.jsx';
import cn from 'classnames';
import {formReducer, INITIAL_STATE} from './JournalForm.state';
import Input from '../Input/Input.jsx';
import {UserContext} from '../../context/user.context.jsx';


function JournalForm({ onSubmit, data, onDelete }) {
	const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
	const { isValid, isFormReadyToSubmit, values } = formState;
	const titleRef = useRef();
	const postRef = useRef();
	const dateRef = useRef();
	const { userId} = useContext(UserContext);

	const focusError = (isValid) => {
		switch (true) {
		case !isValid.title:
			titleRef.current.focus();
			break;
		case !isValid.date:
			dateRef.current.focus();
			break;
		case !isValid.post:
			postRef.current.focus();
			break;
		}
	};

	useEffect(() => {
		if(!data) {
			dispatchForm({type: 'CLEAR'});
			dispatchForm({ type: 'SET_VALUE', payload: { userId }});
		}
		dispatchForm({ type: 'SET_VALUE', payload: { ...data }});
	}, [data]);

	useEffect(() => {
		let timerId;
		if(!isValid.data || !isValid.post || !isValid.title) {
			focusError(isValid);
			timerId = setTimeout(()=> {
				dispatchForm({ type: 'RESET_VALIDITY' });
			},2000);
		}
		return ()=> {
			clearTimeout(timerId);
		};
	}, [isValid]);

	useEffect(() => {
		if( isFormReadyToSubmit ) {
			onSubmit(values);
			dispatchForm({type: 'CLEAR'});
			dispatchForm({ type: 'SET_VALUE', payload: { userId }});
		}
	}, [isFormReadyToSubmit, values, onSubmit, userId]);

	const addJournalItem = (e) => {
		e.preventDefault();
		dispatchForm({ type: 'SUBMIT' });
	};

	useEffect(() => {
		dispatchForm({ type: 'SET_VALUE', payload: { userId }});
	}, [userId]);

	const onChange = (e) => {
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value }});
	};

	const deleteJournalItem =() => {
		onDelete(data.id);
		dispatchForm({type: 'CLEAR'});
		dispatchForm({ type: 'SET_VALUE', payload: { userId }});
	};

	return (
		<form className={styles['journal-form']} onSubmit={addJournalItem}>
			<div className={styles['title-archive']}>
				<Input type="text" id='title' ref={titleRef} isValid={isValid.title} placeholder={userId} appearence='title' name='title'
					value={values.title} onChange={onChange}/>
				{data?.id && <button className={styles['delete']} type='button' onClick={deleteJournalItem}>
					<img src="/archive.svg" alt="archive"/>
				</button> }
			</div>
			<div className={styles['form-row']}>
				<label htmlFor="date" ref={dateRef} className={styles['form-label']}>
					<img src="/calendar.svg" alt="calendar"/>
					<span>Дата</span>
				</label>
				<Input type="date" name='date' isValid={isValid.date} id='date' value={values.date ? new Date(values.date).toISOString().slice(0, 10) : ''}
					onChange={onChange} ref={dateRef}/>
			</div>
			<div className={styles['form-row']}>
				<label htmlFor="date" className={styles['form-label']}>
					<img src="/folder.svg" alt="folder"/>
					<span>Метка</span>
				</label>
				<Input type="text" appearence='text' name='tag' id='tag' value={values.tag} onChange={onChange}/>
			</div>
			<textarea name="post" ref={postRef} cols="30" rows="10" value={values.post} onChange={onChange}
				className={cn(styles['input'], {
					[styles['invalid']]: !isValid.post
				})}/>
			<Button>Сохранить</Button>
		</form>
	);
}

export default JournalForm;