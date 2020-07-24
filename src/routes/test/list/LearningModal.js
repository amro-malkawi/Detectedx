import React from 'react';
import {Dialog, DialogContent} from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';

export default function ({open, onClose, onNext, locale}) {
    if(locale === 'vn') // vietnam
    {
        return (
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                <div style={{padding: 30}}>
                    <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                        <span className={'fs-23'}>Các mục đích học tập:</span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <p>Interactive mammogram interpretation to improve breast cancer detection- module M1</p>
                        <div>
                            <span className="fs-17">Kết thúc đơn vị thực hành này, người dùng sẽ có thể:</span>
                        </div>
                        <ol>
                            <li>
                                <span className="fs-17 mr-10">Nhận biết các biểu hiện ung thư được thể hiện trong bộ nhũ ảnh và qua đó tăng khả năng phát hiện các tổn thương ác tính;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Nhận biết các hình ảnh không có tổn thương ung thư và qua đó giảm thiểu các yêu cầu tái khám không cần thiết;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Cải thiện kỹ năng nhận biết và mô tả các đặc điểm bất thường trong đọc nhũ ảnh kỹ thuật số;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Nhận biết các điểm yếu cá nhân khi tìm kiếm tổn thương ung thư hoặc nhận diện các ca bình thường;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Đánh giá chi tiết về hiệu suất chẩn đoán cá nhân qua 5 thông số được quốc tế công nhận;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Gia tăng sự tự tin khi diễn giải hình ảnh X quang.</span>
                            </li>
                        </ol>
                        <div className={'fs-17 mt-15'}>Thông tin công khai:</div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Patrick C Brennan là Giáo sư chẩn đoán hình ảnh tại Đại học Sydney, đồng thời là CEO và là đồng sáng lập của DetectED-X</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Mary T Rickard là Bác sĩ chẩn đoán hình ảnh, giáo sư thỉnh giảng tại Đại học Sydney, Giám đốc và đồng sáng lập của DetectED-X</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Mo'ayyad E Suleiman là một học giả tại Đại học Sydney, Giám đốc và đồng sáng lập của DetectED-X.</span>
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
        )
    } else {
        return (
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                <div style={{padding: 30}}>
                    <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                        <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <p>Interactive mammogram interpretation to improve breast cancer detection- module M1</p>
                        <div>
                            <span className="fs-17">At the end of this module, the user will be able to</span>
                        </div>
                        <ol>
                            <li>
                                <span className="fs-17 mr-10">Recognise a range of cancer appearances demonstrated in the image learning set and therefore maximise cancer detection;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Be aware of the range of appearances of images without cancer and therefore minimise unnecessary call-backs;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Improve perception and interpretation skills in the reading of digital mammograms;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Demonstrate an awareness of any personal weaknesses when searching for cancers or trying to recognise normal images;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Assess detailed scores on personal performance levels using 5 internationally recognised metrics;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Demonstrate increased confidence when interpreting radiologic images.</span>
                            </li>
                        </ol>
                        <div className={'fs-17 mt-15'}>disclosures:</div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Patrick C Brennan is a Professor of Diagnostic Imaging at the University of Sydney and CEO and Co-founder of DetectED-X</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Mary T Rickard is a Radiologist, Adjunct Professor at the University of Sydney and Director and Co-founder of DetectED-X</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Mo'ayyad E Suleiman is an academic at the University of Sydney and Director and Co-founder of DetectED-X.</span>
                        </div>
                    </DialogContent>
                    {/*<DialogActions>*/}
                    {/*    <div style={{margin: 'auto'}}>*/}
                    {/*        <Button variant="contained" onClick={this.props.onNext} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;<IntlMessages id="test.next"/>&nbsp;&nbsp;</Button>*/}
                    {/*    </div>*/}
                    {/*</DialogActions>*/}
                </div>
            </Dialog>
        )
    }
}