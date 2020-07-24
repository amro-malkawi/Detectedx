import React from 'react';
import {Col} from "reactstrap";

export default function({instructionLocale}) {
    if(instructionLocale === 'vn') {  // vietnam
        return (
            <div>
                <p className={'sub-menu-title'}>Thanh công cụ</p>
                <p>
                    <img src={require("Assets/img/instruction/toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>Nút Next sẽ đưa bạn đến ca tiếp theo
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Nút Instruction sẽ mở tài liệu hướng dẫn
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>Nút Home sẽ đưa bạn đến trang chính các bài test
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/>Nút Series sẽ mở các hình ảnh của một ca nhũ ảnh như thumbnails ở phía bên phải của màn hình.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Nút Reset sẽ phục hồi các tinh chỉnh màn hình case như ban đầu (Phóng to, Cửa sổ và Hình ảnh)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Thay đổi các hình thức hiển thị hình trong một case (các chế độ xem khác nhau và hiển thị các hình trước đây nếu có)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>Xem / ẩn thông tin về tổn thương đã đánh dấu
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Đảo ngược màu hiển thị trên hình
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Xóa các tổn thương đã đánh dấu
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Đánh dấu 1 tổn thương  </p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p> 1. Đặt con trỏ chuột lên vùng bạn muốn đánh dấu </p>
                        <p> 2. Nhấp đúp chuột trái để đánh dấu một tổn thương </p>
                        <p> 3. Một box thông tin sẽ xuất hiện yêu cầu bạn đánh giá tổn thương theo một trong các mức sau: </p>
                        <ul>
                            <li>2 = Lành tính</li>
                            <li>3 = Chưa thể xác định</li>
                            <li>4 = Nghi ngờ</li>
                            <li>5 = Ác tính</li>
                        </ul>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Ghi chú: Trường hợp 3, 4 hoặc 5 mang ý nghĩa là ca có khả năng <span style={{color: '#42A5F5'}}>dương tính cần xem xét / đánh giá thêm.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p> 4. Đối với các tổn thương được đánh giá mức 3 hoặc 4 hoặc 5, bạn sẽ phải mô tả đặc tính của tổn thương, bạn có thể chọn một hoặc nhiều loại. </p>
                            <p> Để chọn một loại tổn thương: </p>
                            <ul>
                                <li>Nhấp chọn mục <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>Một danh sách các loại tổn thương sẽ xuất hiện</li>
                                <li>Nhấp chọn loại tổn thương phù hợp</li>
                                <li>Các mục tiếp theo sẽ xuất hiện tùy thuộc vào sự lựa chọn của bạn.</li>
                            </ul>
                            <p>
                                Ghi chú: Nếu bạn muốn đánh dấu thêm một tổn thương thứ hai, xin vui lòng lặp lại tất cả các bước trên
                            </p>
                            <p className={'mt-10'}>
                                Ghi chú: Nếu bạn muốn thay đổi loại tổn thương đã chọn, bạn có thể nhấp vào giữa vòng tròn màu vàng và chọn loại tổn thương khác.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "45px auto 0"}}/>
                        <img src={require('Assets/img/instruction/img_lesion2.png')} width={'70%'} alt={''} style={{margin: "10px auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Ghi chú:  Nếu bạn thấy cùng một tổn thương trên cả MLO và CC, chúng tôi khuyên bạn nên đánh dấu các vùng trên cả hai thế chụp.
                    Nếu bạn xác định chính xác vị trí tổn thương chỉ trên 1 thế chụp, bạn sẽ nhận được điểm đầy đủ cho <span style={{color: '#42A5F5'}}>chỉ số độ nhạy số tổn thương ác tính.</span>
                    Tuy nhiên, nếu bạn đánh dấu chính xác tổn thương trên cả hai thế chụp, bạn sẽ nhận được điểm đầy đủ cho <span style={{color: '#42A5F5'}}>chỉ số độ nhạy vị trí tổn thương ác tính </span>,
                    được tính vào điểm JAFROC của bạn.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Ca bình thường </p>
                <p>
                    Nếu bạn nghĩ một ca nhũ ảnh là bình thường,
                    bạn chỉ cần chuyển sang trường hợp tiếp theo bằng cách nhấp vào nút <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> trên thanh công cụ.
                    Nhũ ảnh không có điểm đánh dấu sẽ được lưu lại như Rate 1 (bình thường).
                </p>
                <hr/>

                <p>
                    Ghi chú: Một ca nhũ ảnh được đánh dấu với tổn thương Rate 2 (lành tính) được coi là ca bình thường, tức là
                    <span style={{color: '#42A5F5'}}>không yêu cầu xem xét / đánh giá thêm trong tình huống sàng lọc</span>
                    Nếu ca bệnh có chứa tổn thương ác tính mà bạn đánh giá là 2 (lành tính) thì giá trị độ nhạy cảm tổn thương của bạn sẽ bị ảnh hưởng.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Nộp các câu trả lời của bạn </p>
                <p>
                    Khi bạn làm đến ca cuối cùng, nút <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, sẽ xuất hiện trên thanh công cụ.
                    Vui lòng nhấp vào nút này để gửi đáp án của bạn lên hệ thống và bạn sẽ nhận phản hồi ngay lập tức về hiệu suất chẩn đoán của bạn.
                </p>
            </div>
        )
    } else {
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
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Tests main page.
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

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p> 1. Place your mouse pointer over the site you want to mark </p>
                        <p> 2. Double-click to mark a lesion </p>
                        <p> 3. A pop-up menu will appear asking you to rate the lesion: </p>
                        <ul>
                            <li>2 = Benign</li>
                            <li>3 = Equivocal</li>
                            <li>4 = Suspicious</li>
                            <li>5 = Malignant</li>
                        </ul>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this case <span style={{color: '#42A5F5'}}>a positive. i.e. it requires further investigation / assessment.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p> 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                            <p> To select a lesion type: </p>
                            <ul>
                                <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>a list of lesion types will appear.</li>
                                <li>Click on lesion type to select it.</li>
                                <li>Other selection boxes will appear depending on your choice.</li>
                            </ul>
                            <p>
                                Tip: If you want to add a second lesion, please repeat all the above steps.
                            </p>
                            <p className={'mt-10'}>
                                Tip: If you want to change the lesion type on a selected lesion, you can click in the centre of the yellow circle and choose another lesion type.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "45px auto 0"}}/>
                        <img src={require('Assets/img/instruction/img_lesion2.png')} width={'70%'} alt={''} style={{margin: "10px auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                    If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                    However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                </p>
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
}