export const apiHostStatic = 'https://static.detectedx.com'
export const MORE_ICON = { MORE_ICON: true }
export const TOOL = {
    PAN: 'Pan',
    ZOOM: 'Zoom',
    MAGNIFY: 'Magnify',
    WINDOW: 'Wwwc',
    RESET: 'Reset',
    LENGTH: 'Length',
    MARKER: 'Marker',
    MARKER_FREEHAND: 'MarkerFreehand'
}
export const BUTTON = {
    Start: 'Start',
    Continue: 'Continue',
    Restart: 'Re-Start',
    Scores: 'Scores',
}
export const MODALITY_NAME = {
    BreastED_Mammography: 'BreastED - Mammography',
    BreastED_DBT_3D: 'BreastED - DBT 3D',
    DensityED: 'DensityED',
    PCTEducation: 'PCT Education',
    DentalED: 'DentalED',
    GE_CESM: 'GE - CESM ',
    ChestCT: 'CHEST CT',
    Chest: 'CHEST',
    Covid: 'CovED - COVID-19',
    ImagED_Chest: 'ImagED - Chest',
    ImagED_Mammography: 'ImagED - Mammography',
    GE_3D : 'GE 3D ',
    LungED: 'LungED'
}
// --------------------- [ API list ] --------------------- 
const apiHost = Cypress.env('apiUrl')
export const apiLogin = {
    method: 'POST',
    url: `${apiHost}/users/login`
}
export const apiAttempt = {
    method: 'GET',
    url: `${apiHost}/attempts/**`
}
export const apiCouponInfo = {
    method: 'GET',
    url: `${apiHost}/coupons/**`,
}
export const apiUpdateInfo = {
    method: 'POST',
    url: `${apiHost}/users/**`,
}
export const apiChangePassword = {
    method: 'POST',
    url: `${apiHost}/users/change-password*`,
}
export const apiSelectDrownDownList = {
    method: 'GET',
    url: `${apiHost}/scores/attempt_percentile**`
}
export const apiDeleteShapes = {
    method: 'POST',
    url: `${apiHost}/**/delete_all**`
}
export const apiImages = {
    method: 'GET',
    url: `${apiHostStatic}/images/**`
}