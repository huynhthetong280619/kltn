import { Col } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { StoreTrading } from '../../store-trading'
import RestClient from '../../utils/restClient'


const TodoList = () => {
    const { token } = useContext(StoreTrading)

    const [todolist, setTodoslist] = useState([])

    useEffect(() => {
        getTodosList()
    }, [])

    const getTodosList = async () => {
        const restClientAPI = new RestClient({ token })

        await restClientAPI.asyncGet('/subject/deadline')
            .then(res => {
                if (!res.hasError) {
                    const { deadline } = res?.data
                    setTodoslist(deadline)
                }
            })
    }

    return <div>
        <main className="main-todolist-layout">
            <div></div>
            <div className="main-content-todolist">
                <div className="empty-content-todolist"></div>
                <div className="title-empty-content-todolist__f">
                    Bài tập được giao sẽ xuất hiện ở đây
                </div>
                <div className="title-empty-content-todolist__s">
                    Bạn hiện chưa được giao bài tập nào
                </div>
                <div className="todos-item">
                    <div className="todos-item__f">
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Col span={8}></Col>
                            <Col span={8}></Col>
                            <Col span={8}></Col>
                        </Col>
                    </div>
                </div>
            </div>
        </main>
    </div>
}

export default TodoList