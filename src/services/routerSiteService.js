
////front end
import Home from 'Routes/site/home';
import News from 'Routes/site/news';
import NewsContent from "Routes/site/news/content";
import Platform from 'Routes/site/platform';
import Pricing from 'Routes/site/pricing';
import AboutUs from 'Routes/site/about-us';
import ContactUs from 'Routes/site/contact-us';
import Welcome from "Routes/welcome";
import Instructions from "Routes/instructions";
import Test from "Routes/test";

export default [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'news',
        component: News
    },
    {
        path: 'news_content/:id',
        component: NewsContent
    },
    {
        path: 'platform',
        component: Platform
    },
    {
        path: 'pricing',
        component: Pricing
    },
    {
        path: 'about_us',
        component: AboutUs
    },
    {
        path: 'contact_us',
        component: ContactUs
    },


    {
        path: 'welcome',
        component: Welcome
    },
    {
        path: 'instructions',
        component: Instructions
    },
    {
        path: 'test',
        component: Test
    }
]