import React from 'react'

const TodoList = () => {
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
            </div>
        </main>
    </div>
}

export default TodoList