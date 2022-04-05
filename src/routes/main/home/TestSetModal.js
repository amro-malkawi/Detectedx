import React from 'react';
import {Button, Dialog} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function TestSetModal(props) {
    return (
        <Dialog open={true} maxWidth={'xs'}>
            <div className={'main-test-set-modal'}>
                <div className={'test-set-modal-header'}>
                    <img src={require('Assets/img/main/temp_bg.png')} className={'test-set-modal-header-img'} alt={''}/>
                    <div>Breast Cancer Screening</div>
                    <div className={'test-set-modal-header-tags'}>
                        <div className={'modality-type'}>Breast</div>
                        <div className={'mark-3d'}>
                            <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                        </div>
                    </div>
                </div>
                <div className={'test-set-modal-content'}>
                    <div>
                        <div>
                            <span>DIFFICULT</span>
                            <div/>
                            <div/>
                            <div/>
                            <span className={'mr-40'}>60MINS</span>
                            <span className={''}>CME: 1</span>
                            <span>SBMC22-01</span>
                        </div>
                        <div>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim
                            veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut.
                            Aliquip ex ea commodo consequat. Duis autem vel eum iriure doloration adipiscing elit, sed diam nonummy nibh euismod.
                        </div>
                    </div>
                    <div>
                        <div>
                            <Button>Start Assessment</Button>
                            <Button>
                                <span>Save</span>
                                <BookmarkIcon/>
                            </Button>
                        </div>
                        <div>
                            <div>
                                <PlayArrowIcon />
                            </div>
                        </div>
                        <span>INSTRUCTION VIDEO</span>
                    </div>
                </div>
                <div className={'close-btn'}>
                    <i className={'ti ti-close'} />
                </div>
            </div>
        </Dialog>
    )
}

export default TestSetModal;