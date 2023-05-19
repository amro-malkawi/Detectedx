import React from 'react';

export default function ({instructionLocale}) {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/img_imagedmammo1.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next_previous.png")} className={'me-10'} height={40} alt={''}/>Takes you to the previous/next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'me-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'me-10'} height={40} alt={''}/>Will take you to the Tests main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'me-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold, then move the mouse to move
                an image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'me-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Screen configuration)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_rectangle.png")} className={'me-10'} height={40} alt={''}/>Rectangle allows you to measure the breast in a rectangle shape when you click
                and drag to your desired size.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'me-10'} height={40} alt={''}/>Window can make you change the brightness by dragging up and down, and can make
                you change the contrast by dragging left to right on a breast.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_arrow.png")} className={'me-10'} height={40} alt={''}/>Arrow allows you to point at a certain place and then place an annotation.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'me-10'} height={40} alt={''}/>Length allows you to measure from one place to another with a straight line.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_ellipse.png")} className={'me-10'} height={40} alt={''}/>Ellipse allows you to click and drag a circle to your desired size on each
                breast.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_angle.png")} className={'me-10'} height={40} alt={''}/>Angle allows you to create an angle on the breast by clicking and then clicking in
                a second position.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_erase.png")} className={'me-10'} height={40} alt={''}/>Erase allows you to delete all the measurements you have made using the rectangle,
                length, angle and ellipse tool.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_hanging.png")} className={'me-10'} height={40} alt={''}/>Change the hanging protocol for the case so you can view both the left CC and
                right CC and the left MLO and right MLO.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'me-10'} height={40} alt={''}/>Invert image.
            </p>

            <hr/>

            <p className={'sub-menu-title'}>Assessment of Quality of Mammographic Positioning</p>
            <div className={'ms-3 me-3'}>
                <p>
                    Good quality mammography positioning is critical in supporting correct diagnosis.
                    It’s important that as much breast tissue as possible is included on the image and that it is optimally displayed.
                    Imaging all the breast tissue in a consistent and reproducible way assists the radiologist to review the whole breast and compare images, improving diagnostic outcomes.
                </p>
                <p>
                    ImagED-Mammography allows the User to assess a range of measures that evaluate the quality of the positioning of a mammogram.
                    These measures are based on the PGMI (perfect, good, moderate, inadequate) positioning guidelines used by the NHSBSP and BreastScreen Australia.
                    Assessing positioning quality is difficult, as is the positioning itself, and is recognised as being in part subjective.
                    However ImagED-Mammography enables the User to better recognise positioning errors and improve image quality.
                </p>
            </div>
            <hr/>
            <p className={'sub-menu-title'}>Definitions</p>
            <div className={'ms-3 me-3'}>
                <p>
                    On the CC view, the posterior nipple line, PNL, is a line drawn from the nipple perpendicularly to the posterior aspect of the image or the anterior
                    border of the pectoralis major muscle (if seen), whichever comes first.
                </p>
                <p>
                    On the MLO view, the posterior nipple line, PNL, is a line drawn from the nipple perpendicularly to a line drawn along the anterior border of the pectoral
                    muscle (the pectoral line) or to the posterior aspect of the image, whichever comes first.
                </p>
                <img src={require('Assets/img/instruction/img_imagedmammo2.png')} width={'70%'} alt={''} style={{margin: "auto", display: 'block'}}/>
                <p className={'mt-2'} style={{fontSize: 14}}>
                    References:<br/>
                    Cancer Screening Programmes Quality Assurance Guidelines for Mammography, NHSBSP publication No 63 NHS Cancer Screening Programmes, Sheffield 2006 <a href={'www.gov.uk'}>www.gov.uk</a><br/>
                    BreastScreen Australia National Accreditation Standards (NAS) <a href={'www.health.gov.au'}>www.health.gov.au</a>
                </p>
            </div>
            <hr/>

            <p className={'sub-menu-title'}>How to assess a case in ImagED-Mammography</p>
            <div className={'ms-3 me-3'}>
                <p>Start on the 4 view display.</p>
                <img src={require('Assets/img/instruction/img_imagedmammo3.png')} width={'70%'} alt={''} style={{margin: "auto", display: 'block'}}/>
                <p className={'mt-40'}><strong>Using the Window tool</strong>, lighten the image so as to see the nipples clearly and the edges of the images </p>
                <img src={require('Assets/img/instruction/img_imagedmammo4.png')} width={'70%'} alt={''} style={{margin: "auto", display: 'block'}}/>
                <p className={'mt-40'}><strong>Using the Length Tool</strong>, draw the pectoral line and the posterior nipple line on the MLO views and the posterior nipple line on the CC views. </p>
                <img src={require('Assets/img/instruction/img_imagedmammo5.png')} width={'70%'} alt={''} style={{margin: "auto", display: 'block'}}/>

                <p className={'mt-40'}><strong>Proceed to answer the questions.</strong></p>
                <p>
                    You can estimate the relative position of the nipple visually or, using the length tool,
                    you can measure the width of the breast and the distance to the nipple, so as to estimate if the nipple is centrally positioned in the breast.
                </p>
                <p>Similarly you can measure the vertical size of the image and the distance to the nipple, so as to estimate if the nipple is centrally positioned on the image.</p>
                <p>
                    When you have completed the last case, click on the <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/> button, to <strong>receive your score</strong> and to <strong>review your answers</strong> and those of the expert panel.
                    Individual image <strong>PGMI ratings</strong> derived from your answers and the expert answers will also be displayed.
                </p>
            </div>
        </div>
    )
}