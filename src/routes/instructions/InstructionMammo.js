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
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>Nút Home sẽ đưa bạn đến trang các bài test
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_zoom.png")} className={'mr-10'} height={40} alt={''}/>Nút Zoom cho phép bạn phóng to và thu nhỏ hình ảnh bằng cách sử dụng thanh cuộn trên con chuột.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Nút window sẽ cho phép bạn thay đổi độ tương phản và độ sáng của hình ảnh, hãy nhấp và kéo sang trái / phải để điều chỉnh độ tương phản hoặc di chuyển lên /xuống để điều chỉnh độ sáng tối.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_pan.png")} className={'mr-10'} height={40} alt={''}/>Nút Pan cho phép bạn dùng con trỏ chuột để di chuyển hình ảnh.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_length.png")} className={'mr-10'} height={40} alt={''}/>Nút Length cho phép đo khoảng cách giữa hai điểm, vui lòng click vào hai điểm trên hình để đo khoảng cách
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_grid.png")} className={'mr-10'} height={40} alt={''}/>Nhấp vào nút Grid để thay đổi kết cấu hiển thị, vui lòng xem thêm thông tin bên dưới
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Đưa hình trở lại trạng thái ban đầu (độ phóng đại, độ sáng tối tương phản, vị trí hình).
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

                <p className={'sub-menu-title'}> Cửa sổ series hình <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/></p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p>
                            Mở các hình của một ca dưới dạng các hình nhỏ ở phía bên phải của màn hình.<br/>
                            Bạn có thể kéo hình ảnh từ cửa sổ này sang cửa sổ chính để xem thêm hình ảnh trong bài test / đáp án.
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_series.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr />
                <p className={'sub-menu-title'}> The Grid</p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p>
                            Nhấp vào nút Grid sẽ cho phép bạn thay đổi kết cấu màn hình, chọn số lượng màn hình trên trang bài test.<br/>
                            Khi bạn đã chọn kết cấu màn hình, bạn có thể kéo hình ảnh từ cửa sổ Series vào mỗi màn hình.
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_grid.jpg')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr />

                <p className={'sub-menu-title'}> Đánh dấu 1 tổn thương </p>
                <div className={'row'}>
                    <Col sm={7}>
                        <div>
                            <p> 1. Đặt con trỏ chuột lên vùng bạn muốn đánh dấu </p>
                            <p> 2. Nhấp đúp chuột trái để đánh dấu một tổn thương </p>
                            <p> 3. Một hộp thông tin sẽ xuất hiện yêu cầu bạn đánh giá tổn thương theo một trong các mức sau: </p>
                            <ul>
                                <li>2 = Lành tính</li>
                                <li>3 = Chưa thể xác định</li>
                                <li>4 = Nghi ngờ</li>
                                <li>5 = Ác tính</li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Ghi chú: Xếp loại 3, 4 hoặc 5 mang ý nghĩa là ca có khả năng <span style={{color: '#42A5F5'}}>dương tính cần xem xét / đánh giá thêm</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7}>
                        <div>
                            <p> 4. Đối với các tổn thương được đánh giá mức 3 hoặc 4 hoặc 5, bạn sẽ phải mô tả đặc tính của tổn thương, bạn có thể chọn một hoặc nhiều loại.</p>
                            <p> Để chọn một loại tổn thương: </p>
                            <ul>
                                <li>Nhấp chọn mục “Select lesion type” <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>Một danh sách các loại tổn thương sẽ xuất hiện</li>
                                <li>Nhấp chọn loại tổn thương phù hợp</li>
                                <li>Các mục tiếp theo sẽ xuất hiện tùy thuộc vào sự lựa chọn của bạn.</li>
                            </ul>
                            <p>
                                Ghi chú: Nếu bạn muốn đánh dấu thêm tổn thương thứ hai, xin vui lòng lặp lại tất cả các bước trên
                            </p>
                            <p className={'mt-10'}>
                                Ghi chú: Nếu bạn muốn thay đổi loại tổn thương đã chọn, bạn có thể nhấp vào giữa vòng tròn màu vàng và chọn loại tổn thương khác.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                        <img src={require('Assets/img/instruction/img_lesion2.png')} width={'70%'} alt={''} style={{margin: "auto"}} className={'mt-10'}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Ghi chú:  Nếu bạn thấy cùng một tổn thương trên cả MLO và CC, chúng tôi khuyên bạn nên đánh dấu trên cả hai thế chụp.
                    Nếu bạn xác định chính xác vị trí tổn thương chỉ trên 1 thế chụp, bạn sẽ nhận được điểm đầy đủ cho<span style={{color: '#42A5F5'}}>chỉ số độ nhạy tổn thương.</span>
                    Tuy nhiên, nếu bạn đánh dấu chính xác tổn thương trên cả hai thế chụp, bạn sẽ nhận được điểm đầy đủ cho <span style={{color: '#42A5F5'}}>chỉ số độ nhạy tổn thương </span>,
                    được tính vào điểm JAFROC của bạn.alculated for your JAFROC score.
                </p>
                <hr/>
                <p className={'sub-menu-title'}> Xóa 1 tổn thương đã đánh dấu </p>
                <div className={'row'}>
                    <Col sm={7}>
                        <p> Di chuyển chuột đến tâm của vòng tròn hoặc các cạnh của vùng chọn tự do,
                            vùng chọn sẽ được tô sáng, hãy click vào đó và cửa sổ thông tin tổn thương sẽ xuất hiện, hãy chọn <span style={{color: '#42A5F5'}}>Delete</span> để xóa.
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion3.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>

                <p className={'sub-menu-title'}> Ca bình thường </p>
                <p>
                    Nếu bạn cho rằng một trường hợp là bình thường, bạn chỉ cần chuyển sang trường hợp tiếp theo bằng cách nhấp vào nút <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> trên thanh công cụ.
                    Hình không có bất kỳ vùng đánh dấu nào sẽ được xếp loại là 1 (ca bình thường).
                </p>
                <hr/>

                <p>
                    Ghi chú: Một ca được đánh dấu với tổn thương ở mức 2 (lành tính) được coi là ca bình thường, tức là <span style={{color: '#42A5F5'}}>không yêu cầu xem xét / đánh giá thêm trong tình huống sàng lọc. .</span>
                    Nếu ca bệnh có chứa tổn thương ác tính mà bạn đánh giá là 2 (lành tính) thì giá trị độ nhạy tổn thương của bạn sẽ bị ảnh hưởng
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Nộp các câu trả lời của bạn </p>
                <p>
                    Khi bạn làm đến ca cuối cùng, nút <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/> sẽ xuất hiện trên thanh công cụ.
                    Vui lòng nhấp vào nút này để gửi đáp án của bạn lên hệ thống và bạn sẽ nhận phản hồi ngay lập tức về các kết quả chẩn đoán của bạn.
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
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>Takes you to the next case.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>Will take you to the Tests main page.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_zoom.png")} className={'mr-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_pan.png")} className={'mr-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold then move the mouse to move an image
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_length.png")} className={'mr-10'} height={40} alt={''}/>To measure the distance between two points, select the length tool, then click on the two points in the image to measure the distance.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_grid.png")} className={'mr-10'} height={40} alt={''}/>Click on the Grid button to change the screen configeration, please see below for more information.
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

                <p className={'sub-menu-title'}> Series window <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/></p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p>
                            Opens the images of a case as thumbnails on the right side of the screen.<br/>
                            You can drag images from this window to the main windows allowing you too viewextra images on the test/answers windows.
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_series.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr />
                <p className={'sub-menu-title'}> The Grid</p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p>
                            Clicking the Grid button will allow you to change the screen configuration, choosing the number of screens on the test page.<br/>
                            Once you have chosen the screen configuration, you can then drag images from the Series window into each screen.
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_grid.jpg')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr />

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7}>
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
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7}>
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
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                        <img src={require('Assets/img/instruction/img_lesion2.png')} width={'70%'} alt={''} style={{margin: "auto"}} className={'mt-10'}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                    If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                    However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                </p>
                <hr/>
                <p className={'sub-menu-title'}> Delete a cancer selection </p>
                <div className={'row'}>
                    <Col sm={7}>
                        <p> Move the mouse to the center of the circle or the sides of a freehand selection, the selection will be highlighted, click and a popup window will appear,
                            select <span style={{color: '#42A5F5'}}>Delete</span>
                        </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion3.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>

                <p className={'sub-menu-title'}> Normal cases </p>
                <p>
                    If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar.
                    An unannotated image will be recorded as rating 1 (normal).
                </p>
                <hr/>

                <p>
                    Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                    If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Submit your answers: </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                    feedback on your performance.
                </p>
            </div>
        )
    }
}