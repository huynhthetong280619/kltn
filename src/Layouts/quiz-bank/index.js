import React, { useState } from 'react';
import { Form, Input, Button, Table } from 'antd'
import { useTranslation } from 'react-i18next';
import readXlsxFile from 'read-excel-file'
import { isEmpty } from 'lodash';
import RestClient from '../../utils/restClient';
import ModalWrapper from '../../components/basic/modal-wrapper';

const QuizBank = ({ idSubject,
	closeModalCurrentQuizBank, quizList }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm();
	const [quizBankData, setQuizBankData] = useState({})
	const restClient = new RestClient({ token: '' })
	const formItemLayout = {
		labelCol: {
			span: 4,

		},
	};

	const handleProcessFile = (e) => {
		const nameQuiz = e.target.value.split("\\")[e.target.value.split("\\").length - 1];
		readXlsxFile(e.target.files[0]).then(res => {
			const data = res.map(row => {
				const question = row[0]
				const typeQuestion = row[1]
				const answer = []
				let i = 0;
				row.slice(2).forEach(ans => {
					if (!row.slice(2)[i]) {
						return
					}
					answer.push({
						answer: row.slice(2)[i],
						isCorrect: row.slice(2)[i + 1] == 'D' ? true : false
					})
					i += 2;
				})

				return {
					typeQuestion,
					question,
					answers: answer
				}
			})


			setQuizBankData({
				name: nameQuiz,
				questions: data
			})
		})
	}

	const onFinish = (values) => {
		if (!isEmpty(quizBankData)) {
			restClient.asyncPost(`/quiz-bank/?idCourse=${idSubject}`, { idSubject, data: quizBankData })
				.then(res => {
					if (!res.hasError) {
						console.log(res)
						closeModalCurrentQuizBank()
					}
				})
		}
	}



	const columns = [
		{
			title: 'STT',
			dataIndex: '_id',
			key: '_id',
			render: (data, row, index) => index
		},
		{
			title: 'Tên ngân hàng',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số lượng câu hỏi',
			dataIndex: 'questionCount',
			key: 'questionCount',
			fixed: 'center'
		},
	];


	return <><Form
		{...formItemLayout}
		onFinish={onFinish}
		form={form}
	>
		<Form.Item
			label={t('fileAttach')}
		>
			<Input type="file" accept='.xlsx' style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
		</Form.Item>

		<Form.Item>
			<Button type="primary" htmlType="submit">
				{t('import_subject')}</Button>
		</Form.Item>

	</Form>
		<ModalWrapper>
			<div>Ngân hàng đề hiện tại</div>
			<div className="style-table">
				<Table dataSource={quizList} columns={columns} pagination={false} />
			</div>
		</ModalWrapper>
	</>
}

export default QuizBank