/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)

const Notifications = Loadable({
   loader: () => import("./Notifications"),
   loading: MyLoadingComponent
});

const SessionSlider = Loadable({
   loader: () => import("./SessionSlider"),
   loading: MyLoadingComponent
})

export {
   Notifications,
   SessionSlider,
}