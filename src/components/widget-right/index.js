import React, { useState } from 'react'
import './widget.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../font-awesome-icon'
import { useTranslation } from 'react-i18next';


const WidgetRight = ({
     }) => {
    const { t } = useTranslation()
   

    return (<>
        <div className="container-right">
            <a>
                <i><FontAwesomeIcon icon="download" /></i>
                {/* <span>{t('export')}</span> */}
            </a>
            <a>
                <i><FontAwesomeIcon icon="upload" /></i>
                {/* <span>{t('import')}</span> */}
            </a>
        </div>
    </>
    )
}


export default WidgetRight