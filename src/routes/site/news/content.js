import React, {Component} from 'react';
import {Col} from "reactstrap";
import ImageGallery from 'react-image-gallery';

export default class NewsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [
                {
                    title: 'DetectED-X sings a three-year partnership with the Slovenian Breast Cancer Screening Program (Dora)',
                    desc: "DetectED-X is delighted to announce an exciting new three-year partnership with the Slovenian Breast Cancer Screening Program (Dora). The aim of this agreement is to enhance the early detection of breast cancer in Slovenia thus improving mortality rates for women in Slovenia.  DetectED-X will work closely with the Institute of Oncology Ljubljana to make its exciting new education software – Rivelato available to all breast screening radiologists in Slovenia.  The software will be available on-line to any radiologist wherever he or she is located, will monitor performance and instantly make available to each radiologist details on any errors being made.  Patrick Brennan CEO of DetectED-X believes that this will be a game changer in radiologist education and is very grateful to Drs Maksimiljan Kadivec and Kristijana Hertl for their enthusiastic engagement with the project.",
                    images: [
                        {
                            original: require('Assets/img/site/news/1_1.png'),
                        },
                        {
                            original: require('Assets/img/site/news/1_2.png'),
                        },
                    ],
                },
                {
                    title: 'DetectED-X launches its products in the Middle East at Arab Health and Total Radiology Conference, Dubai 2020.',
                    desc: 'DetectED-X was delighted to launch its products in the Middle East at Arab Health 2020.  Its globally leading education software based on test set technologies was demonstrated to clinicians and industry and its important and proven impact on clinical and test set performance was of much interest.  In particular the fact that radiologists could logon anywhere in the world at any time or day and access our products whilst receiving CMEs from the US and elsewhere was highly appreciated by busy clinicians.  The products will form a seamless addition to the maintenance of clinical performance by all radiologists reading medical images.',
                    images: [
                        {original: require('Assets/img/site/news/2_1.jpg')},
                        {original: require('Assets/img/site/news/2_2.jpg')},
                        {original: require('Assets/img/site/news/2_3.jpg')},
                        {original: require('Assets/img/site/news/2_4.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X launches its products in the US at RSNA 2019.',
                    desc: 'DetectED-X was delighted to launch its products in the US at RSNA 2019.  Its globally leading education software based on test set technologies was demonstrated to clinicians and industry and its important and proven impact on clinical and test set performance was of much interest.  In particular the fact that radiologists could logon anywhere in the world at any time or day and access our products whilst receiving CMEs from the US and elsewhere was highly appreciated by busy clinicians.  The products will form a seamless addition to the maintenance of clinical performance by all radiologists reading medical images.',
                    images: [
                        {original: require('Assets/img/site/news/3_1.jpg')},
                    ]
                },
                {
                    title: 'Partnership agreement between DetectED-X and Ministry of Health New Zealand',
                    desc: 'On the 22nd November 2019, an exciting new three-year partnership agreement between DetectED-X and the Ministry of Health in New Zealand was signed. ' +
                        'This partnership is aimed at optimising radiologic reading within the BreastScreen Aotearoa and involves Detected-X’s Rivelato Online educational program being made available to all screening radiologists across New Zealand. ' +
                        'Radiologists and trainees wherever they are located can, any time of the day (or night) access the Rivelato program simply through a logon and attempt to diagnose a series of de-identified breast images with known truth.  The built in algorithms will monitor radiologist performance and then on each individual image identify for each individual radiologist where and when an error was made. This approach has been shown to enhance clinical performance by 30%. ' +
                        'Jane O\'Hallahan, Clinical Director of the National Screening Unit  says “I am delighted with this agreement which should help radiologists regardless of training or level of expertise.  The Rivelato program  should offer real clinical benefits for women attending BreastScreen Aotearoa”. ',
                    images: [
                        {original: require('Assets/img/site/news/4_1.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X receives accreditation in the US',
                    desc: 'DetectED-X is delighted that its products have now received accreditation in the US.  The US-based Accreditation Council for Continuing Education (ACCME) has agreed that a clinicians involvement with even one of the DetectED-X’s products is worth 6 Credits and certification.  According to the ACCME, this accredited activity “accelerates learning, change and improvement in healthcare”.  Patrick Brennan, DetectED-X’s CEO is delighted with this new recognition and says “whilst we have had accreditation from countries such as Australia and New Zealand, to now have US accreditation demonstrates the international importance of our exciting and novel educational products.  The timing of this accreditation is perfect as we are currently moving into new markets in the US, China, Middle East and Europe” ' +
                        'This accreditation was made possible through a partnership with AKH (Advancing Knowledge in Healthcare), a body renowned globally for its continuing education for licensed healthcare professionals involving programs that adhere to the highest education and accreditation standards.',
                    images: [
                        {original: require('Assets/img/site/news/5_1.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X wins best startup of the year ',
                    desc: 'DetectED-X was awarded Australasian Startup of the Year for Community and Social Good. This competition was organised by StartCon, Australia’s largest startup and growth conference and involved companies from across the 48 Asian Pacific countries. ' +
                        'A big thank you to all who supported us through this, and special thank you to Incubate and Sydney Knowledge Hub at the University of Sydney.',
                    images: [
                        {original: require('Assets/img/site/news/6_1.jpg')},
                        {original: require('Assets/img/site/news/6_2.jpg')},
                        {original: require('Assets/img/site/news/6_3.jpg')},
                        {original: require('Assets/img/site/news/6_4.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X shortlisted for startup of the year',
                    desc: 'The annual Australasian Startup Awards recognises the most innovative and disruptive start-ups, companies and people in the Australasian region. ' +
                        'DetectED-X is one of the top 5 shortlisted companies in two categories this year: ' +
                        'Startup of the Year This award recognises the most promising Startups of 2019 ' +
                        'Best Startup for Social or Community Good ' +
                        'The startup that is creating a significant positive impact on society.',
                    images: [
                        {original: require('Assets/img/site/news/7_1.png')},
                        {original: require('Assets/img/site/news/7_2.png')},
                    ]
                },
                {
                    title: 'DetectED-X at RANZCR 2019',
                    desc: 'The delegates of the 70th Annual Scientific Meeting of the Royal Australian and New Zealand College of Radiologists had the very first look at the brand new DetectED-X software, Rivelato, the leading edge in radiology education. ' +
                        'Radiologists from all over the world participated in the inaugural DetectED-X workshop held in RANZCR 2019 in Auckland New Zealand, where they interpreted 60 mammographic cases on Rivelato, and received immediate feedback on their diagnostic performance. Radiologists had the opportunity to review their decisions on each image marked against the correct answer and collect CME points for this activity. ' +
                        'Photo: Dr Moe Suleiman outside the DetectED-X workshop room',
                    images: [
                        {original: require('Assets/img/site/news/8_1.jpg')},
                        {original: require('Assets/img/site/news/8_2.jpg')},
                        {original: require('Assets/img/site/news/8_3.jpg')},
                        {original: require('Assets/img/site/news/8_4.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X and Kuwait',
                    desc: 'On the 17th October 2019 a meeting was held between Professor Patrick Brennan CEO DetectED-X and Dr. Hanaa Al-Khawari Standing Commission Decision and Chairperson of the Implementation Committee of Kuwait National Mammography Screening Program. ' +
                        'Breast cancer is one of the key health priorities for Kuwait.  It is the most common female malignancy in Kuwait accounting for 23% of all cancers and 50% of cancers among females. ' +
                        'In recent decades, the incidence of breast cancer has tripled and it is now estimated that 23% of all women will experience the disease.  With an age standardised rate of 59 cases per 100,000 women, breast cancer incidence in Kuwait is one of the highest in the Middle Eastern region.  It was clear that the detection platform Rivelato created by DetectED-X would complement current teaching, research and quality assurance activities in Kuwait so that early detection of breast cancer is promoted.',
                    images: [
                        {original: require('Assets/img/site/news/9_1.jpg')},
                        {original: require('Assets/img/site/news/9_2.jpg')},
                    ]
                },
                {
                    title: 'DetectED-X and Qatar Ministry of Health Partnership.',
                    desc: 'DetectED-X’s CEO Prof Patrick Brennan and Director for Middle East Relations, Dr. Mohammad Rawashdeh, met with Senior Qatari Officials to establish the introduction of DetectED-X radiological solutions across the Qatari breast screening program. ' +
                        'Meetings were held between DetectED-X and Ministry of Public Health, Primary Care Health Corporation, Hamad Medical Corporation, National Centre for Cancer Care and Research, Specialised Medical Solutions, and senior Clinical Radiologists and Oncologists at Rawdat Al Khail Health Care Centre and Women’s Wellness and Research Center. ' +
                        'Pictured is DetectED-X’s Patrick Brennan and Mohammad Rawashdeh.',
                    images: [
                        {original: require('Assets/img/site/news/10_1.jpg')},
                        {original: require('Assets/img/site/news/10_2.jpg')},
                        {original: require('Assets/img/site/news/10_3.jpg')},
                        {original: require('Assets/img/site/news/10_4.jpg')},
                        {original: require('Assets/img/site/news/10_5.jpg')},
                        {original: require('Assets/img/site/news/10_6.jpg')},
                    ]
                },
            ]
        }
    }

    render() {
        const index = this.props.match.params.id;
        return (
            <div className={"site-news-content"}>
                <div className={'row'}>
                    <Col sm={7} className={'content-gallery'}>
                        <div>
                            <ImageGallery items={this.state.content[index].images} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} autoPlay={true} slideInterval={3000} showBullets/>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div className={'content'}>
                            <p className={'content-title'}>
                                {this.state.content[index].title}
                            </p>
                            <div className={'content-split'}/>
                            <p className={'content-desc'}>
                                {this.state.content[index].desc}
                            </p>
                        </div>
                    </Col>
                </div>
            </div>
        )
    }
}