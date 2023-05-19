import React from 'react';

export default function () {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar_covid.jpg")} className={"mt-20 white-border"} width="100%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next.png")} className={'me-10'} height={40} alt={''}/>takes you to the next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'me-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'me-10'} height={40} alt={''}/>will take you to the Tests main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset1.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'me-10'} height={40} alt={''}/>Invert image
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Slices </p>
            <div>
                <p> Each view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices.</p>
                <img src={require('Assets/img/instruction/img_covid1.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Diagnosing a care </p>
            <div>
                <p>
                    <span className={'circle-number'}>1</span> You will see a number of cases of Lung CT within this test set, some of these will contain appearances typical of COVID-19, some will not.
                    Your task is to identify on each case if any of the following appearances are present:
                </p>
                <ul>
                    <li>Ground glass Opacity;</li>
                    <li>Consolidation;</li>
                    <li>Crazy paving/Mosaic attenuation.</li>
                </ul>
            </div>
            <div className={'row mt-30'}>
                <div className={'col-sm-6'}>
                    <p><span className={'circle-number'}>2</span> If you feel any of these appearances are present, you will be asked if this appearance is:</p>
                    <ul>
                        <li>In the upper, lower section of the chest as defined in the diagram below.</li>
                        <li>On the left side, right side or both</li>
                        <li>In the anterior or posterior halves of the chest</li>
                        <li>Whether the <span style={{color: 'red'}}>collective COVID</span> appearances are peripheral, central or both</li>
                    </ul>
                </div>
                <div className={'col-sm-6'}>
                    <img src={require('Assets/img/instruction/img_covid.jpg')} width={'90%'} alt={''} className={'ms-10'}/>
                </div>
            </div>
            <div className={'mt-30'}>
                <p>
                    <span className={'circle-number'}>3</span> Finally, based on your assessment of the case, you will be asked to give a score of 0-5 indicating whether you think this case is COVID-19 positive or not.
                    This scoring will be defined as:
                </p>
                <p className={'ms-30'}> 0: Absolutely confident that this case is not COVID-19 positive </p>
                <p className={'ms-30'}> 1: Very confident that this case is not COVID-19 positive </p>
                <p className={'ms-30'}> 2: Quite confident that this case is not COVID-19 positive</p>
                <p className={'ms-30'}> 3: Quite confident that this case is COVID-19 positive</p>
                <p className={'ms-30'}> 4: Very confident that this case is COVID-19 positive</p>
                <p className={'ms-30'}> 5: Absolutely confident that this case is COVID-19 positive</p>
            </div>
            <img src={require('Assets/img/instruction/img_covid2.jpg')} width={'100%'} alt={''} className={'ms-10'}/>
            <hr/>
            <p>
                Please note, this scoring is based on your confidence that the appearance of COVID-19 is present, not on the severity of the disease.
            </p>
            <hr/>
            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                feedback on your performance.
            </p>
        </div>
    )
}