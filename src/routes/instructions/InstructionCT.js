import React from 'react';

export default function() {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>takes you to the next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Modules main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/>Opens the images of a case as tumbnails on the right side of the screen.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case (different views and show priors if available)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Slices </p>
            <div className={'row'}>
                <p> Each breast view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                <img src={require('Assets/img/instruction/img_ct.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Marking a lesion </p>
            <div className={'row'}>
                <div className={'col-sm-7'} className={'right-border'}>
                    <div>
                        <p> 1. Place your mouse pointer over the site you want to mark </p>
                        <p> 2. Double-click to mark a lesion </p>
                        <p> 3. A pop-up menu will appear asking you to rate the lesion: </p>
                        <ul>
                            <li>2 = Benign</li>
                            <li>3 = Equivocal</li>
                            <li>4 = Suspicious</li>
                            <li>5 = Malignant</li>
                        </ul>
                    </div>
                </div>
                <div className={'col-sm-5'}>
                    <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                </div>
            </div>
            <hr/>
            <p>
                Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
            </p>
            <hr/>

            <div className={'row'}>
                <div className={'col-sm-7'} className={'right-border'}>
                    <div>
                        <p> 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                        <p> To select a lesion type: </p>
                        <ul>
                            <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                            <li>a list of lesion types will appear.</li>
                            <li>Click on lesion type to select it.</li>
                            <li>If you want to change the lesion type, then you can click again on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> and choose another lesion
                                type.
                            </li>
                        </ul>
                        <p>Tip: If you want to add a second lesion, please repeat all the above steps.</p>
                    </div>
                </div>
                <div className={'col-sm-5'}>
                    <img src={require('Assets/img/instruction/img_list_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                </div>
            </div>
            <hr/>


            <p className={'sub-menu-title'}> Normal cases </p>
            <p>
                If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be
                recorded as rating 1 (normal).
            </p>
            <hr/>

            <p>
                Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
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