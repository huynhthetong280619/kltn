import React, { useState } from 'react'
import './widget.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../font-awesome-icon'
import { useTranslation } from 'react-i18next';
import { notifyError, notifySuccess } from '../../assets/common/core/notify';
import RestClient from '../../utils/restClient';
import ExportSubject from '../../Layouts/exportSubject/exportSubject';
import ImportSubject from '../../Layouts/importSubject/importSubject';
import { useLocation } from 'react-router';
import ModalWrapper from '../basic/modal-wrapper';
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import Modal from 'antd/lib/modal/Modal';


const WidgetRight = ({
     setImportState, setExportState,
    
    setIsOpenModalFunction
}) => {
    const { t } = useTranslation()


    return (<>
        <div className="container-right">
            <a>
                <i><FontAwesomeIcon icon="download" onClick={(e) => { e.preventDefault(); setIsOpenModalFunction(true); setExportState(true)}} /></i>
                {/* <span>{t('export')}</span> */}
            </a>
            <a>
                <i><FontAwesomeIcon icon="upload" onClick={(e) => {e.preventDefault();setIsOpenModalFunction(true); setImportState(true)}} /></i>
                {/* <span>{t('import')}</span> */}
            </a>
        </div>
     
    </>
    )
}


export default WidgetRight