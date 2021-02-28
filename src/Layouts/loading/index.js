import React from "react";
import Loading from '../../assets/images/loading.gif'
import './styles.scss'

const LoadingView = () => {
    return (
            <div className="loading-view">
                <img src={Loading} width="200px" alt="" />
            </div>
    );
};


export default LoadingView;
