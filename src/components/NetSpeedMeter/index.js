import React, {useEffect} from 'react'
import axios from "axios";

const NetSpeedMeter = ({
                           pingInterval = 30000,
                           thresholdUnit = 'megabyte',
                           imageUrl = "https://res.cloudinary.com/dcwxsms2l/image/upload/v1610376487/pexels-ivan-samkov-6291574_bzqgps.jpg",
                           downloadSize = "1781287", //bytes
                           callbackFunctionOnNetworkDown = () => console.log("No callback on Network Down"),
                       }) => {

    let intervalFun, startTime, endTime;

    const startInterval = () => {
        MeasureConnectionSpeed();
        return window.setInterval(MeasureConnectionSpeed, pingInterval);
    }

    useEffect(() => {
        intervalFun = startInterval()
        return () => window.clearInterval(intervalFun)
    }, [])

    const downProgress = (progressEvent) => {
        const currentTime = (new Date()).getTime();
        console.log(calcDownSpeed(startTime, currentTime, progressEvent.currentTarget.response.length, thresholdUnit), progressEvent.currentTarget.response.length);
    }

    const MeasureConnectionSpeed = () => {
        startTime = (new Date()).getTime();
        let cacheBuster = "?nnn=" + startTime;
        axios.get(
            imageUrl + cacheBuster,
            {
                onDownloadProgress: downProgress
            }
        ).then(() => {
            endTime = (new Date()).getTime();
            callbackFunctionOnNetworkDown(calcDownSpeed(startTime, endTime, downloadSize, thresholdUnit));
        }).catch((err) => {
            console.log('err', err)
            window.clearInterval(intervalFun)
        });
    }

    const calcDownSpeed = (donwStartTime, downEndTime, downloadSize, unit) => {
        const duration = (downEndTime - donwStartTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = (bitsLoaded / duration).toFixed(2);
        const speedKbps = (speedBps / 1024).toFixed(2);
        const speedMbps = (speedKbps / 1024).toFixed(2);
        if (thresholdUnit === 'byte') {
            return speedBps;
        } else if (thresholdUnit === 'kilobyte') {
            return speedKbps;
        } else if (thresholdUnit === 'megabyte') {
            return speedMbps;
        } else {
            console.log('Invalid thresholdUnit')
        }
    }

    return <div/>
}

export default NetSpeedMeter;