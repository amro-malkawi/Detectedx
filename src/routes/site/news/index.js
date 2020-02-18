import React, {Component} from 'react';
import {Col} from "reactstrap";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    image: require('Assets/img/site/news/1.png'),
                    desc: 'DetectED-X signs a three year partnership with the Slovenian Breast Cancer Screening Program (Dora).',
                    date: 'Jan 30th, 2020'
                },
                {
                    image: require('Assets/img/site/news/2.jpg'),
                    desc: 'DetectED-X launches its products in the Middle East at Arab Health and Total Radiology Conference, Dubai 2020.',
                    date: 'Jan 27th, 2020'
                },
                {
                    image: require('Assets/img/site/news/3.jpg'),
                    desc: 'DetectED-X launches its products in the US at RSNA 2019.',
                    date: 'Dec 2nd, 2019'
                },
                {
                    image: require('Assets/img/site/news/4.jpg'),
                    desc: 'Partnership agreement between DetectED-X and Ministry of Health New Zealand',
                    date: 'Dec 1st, 2019'
                },
                {
                    image: require('Assets/img/site/news/5.jpg'),
                    desc: 'DetectED-X receives accreditation in the US',
                    date: 'Nov 25th, 2019'
                },
                {
                    image: require('Assets/img/site/news/6.jpg'),
                    desc: 'DetectED-X wins Australasian startup of the year',
                    date: 'Nov 22nd, 2019'
                },
                {
                    image: require('Assets/img/site/news/7.png'),
                    desc: 'DetectED-X finalist Australasian startup of the year',
                    date: '25th Oct, 2019'
                },
                {
                    image: require('Assets/img/site/news/8.jpg'),
                    desc: 'DetectED-X at RANZCR 2019',
                    date: 'Oct 16th-20th, 2019'
                },
                {
                    image: require('Assets/img/site/news/9.jpg'),
                    desc: 'DetectED-X and Kuwait',
                    date: 'Oct 10th, 2019'
                },
                {
                    image: require('Assets/img/site/news/10.jpg'),
                    desc: 'DetectED-X and Qatar Ministry of Health Partnership',
                    date: 'Sep 22nd, 2019'
                },
            ]
        }
    }

    render() {
        return (
            <div className={'site-news'}>
                {
                    this.state.data.map((v, i) => (
                        <div className={'row news-item mt-20 mb-70'} key={i}>
                            <Col sm={4}>
                                <div className={'img-container'}>
                                    <img src={v.image}/>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <span className={'news-desc'}>{v.desc}</span>
                            </Col>
                            <Col sm={2}>
                                <div>
                                    <span className={'news-time'}>{v.date}</span>
                                </div>
                                <div>
                                    <Button component={Link} to={"/site/news_content/" + i} variant="contained" className="news-more">
                                        VIEW MORE
                                    </Button>
                                </div>
                            </Col>
                        </div>
                    ))
                }
            </div>
        )
    }
}