import React from 'react';
import { Dialog, DialogContent } from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';

export default function ({ open, name, postTestCount, credit, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
      <div style={{ padding: 30, height: '100%', overflow: 'auto' }}>
        <div lang="EN-US" link="blue" vlink="#954F72" style={{ tabInterval: '36.0pt', height: '70vh', overflow: 'auto' }}>
          <div className="WordSection1">
            <p className="MsoNormal" align="center" style={{ marginBottom: '.0001pt', textAlign: 'center', lineHeight: 'normal' }}>
              <a name="_Hlk481069507"><b style={{ msoBidiFontWeight: 'normal' }}><span
                style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black', msoColorAlt: 'windowtext', background: 'white' }}>DetectED-X</span></b></a>
              <span>
                <b style={{ msoBidiFontWeight: 'normal' }}>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', background: 'white' }}>
                  </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" align="center" style={{ marginBottom: '.0001pt', textAlign: 'center', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                  {name}<span style={{ background: 'lime', msoHighlight: 'lime' }}><br />
                  </span>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}><br />
                <b>Program Overview</b><br />
              </span></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif' }}>
                  Women with dense breast tissue “have the ‘perfect storm’ of decreased mammographic
                  sensitivity and increased risk of breast cancer” (Brem RF et al., AJR Am J Roentgenol 2015; 204:234–240).
              </span>
              </span>
            </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '19pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  The sensitivity of mammography reduces as the proportion of fibroglandular tissue increases.
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '19pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Visual assessments have limitations that cause disagreement among readers:
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '40pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>o<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Visual assessments are area based. Such assessments do not consider the depth of fat or fibroglandular tissue
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '40pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>o<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Visual assessments are subjective.
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '40pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>o<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Visual assessments rely on “For Presentation” images. Imaging systems, modes (e.g., 2D, 3D, or synthetic 2D), and processing algorithms all vary the appearance of “For Presentation” images.
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '19pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Identifying women with extremely dense breast tissue is important to reducing the risk of missing breast cancer at the time of screening.
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '19pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  Automated volumetric assessments of breast composition performed by Density software are objective, consistent,
                  and repeatable and have been shown to correlate with BI RADS® breast composition categories.
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
              <p className="MsoListParagraphCxSpFirst" style={{
                  marginTop: '0cm',
                  marginRight: '0cm',
                  marginBottom: '.0001pt',
                  marginLeft: '19pt',
                  msoAddSpace: 'auto',
                  textIndent: '-18.0pt',
                  lineHeight: 'normal',
                  msoList: 'l3 level1 lfo5',
                  background: 'white'
              }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                    style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  At the end there will be a {postTestCount}-image posttest and if passed a CME certificate will be issued
              </span>
              </span>
                  <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
              </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}><br />
                <b>Target Audience</b><br />
              </span></span> <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                  This activity is designed for radiologists and other health professionals to assess breast density from mammography x-rays.
                <span style={{ color: '#333333' }}>
                    <br />
                    <br />
                    <b>Learning Objectives</b><br />
                  Upon completion of the educational activity, participants should be able to:<br/>
                    Upon completion of this activity, participants should be able to
                </span>
                </span>
              </span>
            </p>
            <p className="MsoListParagraphCxSpFirst" style={{
              marginTop: '0cm',
              marginRight: '0cm',
              marginBottom: '.0001pt',
              marginLeft: '54.0pt',
              msoAddSpace: 'auto',
              textIndent: '-18.0pt',
              lineHeight: 'normal',
              msoList: 'l3 level1 lfo5',
              background: 'white'
            }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                  style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  describe and distinguish the four BI-RADS® breast composition categories according to BI‑RADS® 5th Edition guidelines;
              </span>
              </span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoListParagraphCxSpMiddle" style={{
              marginTop: '0cm',
              marginRight: '0cm',
              marginBottom: '.0001pt',
              marginLeft: '54.0pt',
              msoAddSpace: 'auto',
              textIndent: '-18.0pt',
              lineHeight: 'normal',
              msoList: 'l3 level1 lfo5',
              background: 'white'
            }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                  style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  	understand the limitations of visual assessment of breast density;
              </span>
              </span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoListParagraphCxSpMiddle" style={{
              marginTop: '0cm',
              marginRight: '0cm',
              marginBottom: '.0001pt',
              marginLeft: '54.0pt',
              msoAddSpace: 'auto',
              textIndent: '-18.0pt',
              lineHeight: 'normal',
              msoList: 'l3 level1 lfo5',
              background: 'white'
            }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                  style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  	understand the impact of breast volume when assessing breast density;
              </span>
              </span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoListParagraphCxSpMiddle" style={{
              marginTop: '0cm',
              marginRight: '0cm',
              marginBottom: '.0001pt',
              marginLeft: '54.0pt',
              msoAddSpace: 'auto',
              textIndent: '-18.0pt',
              lineHeight: 'normal',
              msoList: 'l3 level1 lfo5',
              background: 'white'
            }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: 'Symbol', msoFareastFontFamily: 'Symbol', msoBidiFontFamily: 'Symbol' }}><span style={{ msoList: 'Ignore' }}>·<span
                  style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span></span></span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black', msoColorAlt: 'windowtext' }}>
                  develop a consistent approach to breast density assessment;
              </span>
              </span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoListParagraphCxSpLast"
              style={{ marginTop: '0cm', marginRight: '0cm', marginBottom: '.0001pt', marginLeft: '54.0pt', msoAddSpace: 'auto', lineHeight: 'normal', background: 'white' }}>
              <span />
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b style={{ msoBidiFontWeight: 'normal' }}>
                  <span style={{ fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                    Activity is jointly-provided by AKH Inc.,
                    Advancing Knowledge in Healthcare and DetectED-X.
                </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b style={{ msoBidiFontWeight: 'normal' }}>
                  <span style={{ fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  </span>
                </b>
              </span>
            </p>
            <table className="MsoTableGrid" border={1} cellSpacing={0} cellPadding={0} style={{
              borderCollapse: 'collapse',
              border: 'none',
              msoBorderAlt: 'solid black .5pt',
              msoBorderThemecolor: 'text1',
              msoYftiTbllook: 1184,
              msoPaddingAlt: '0cm 5.4pt 0cm 5.4pt'
            }}>
              <tbody>
                <tr style={{ msoYftiIrow: 0, msoYftiFirstrow: 'yes' }}>
                  <td width={623} colSpan={3} valign="top" style={{
                    width: '467.5pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    background: 'gray',
                    msoBackgroundThemecolor: 'background1',
                    msoBackgroundThemeshade: 128,
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" align="center"
                      style={{ marginBottom: '.0001pt', textAlign: 'center', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <b style={{ msoBidiFontWeight: 'normal' }}>
                          <span style={{ fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', color: 'white', msoThemecolor: 'background1' }}>
                            FACULTY DISCLOSURES
                        </span>
                        </b>
                      </span>
                    </p>
                  </td>
                </tr>
                <tr style={{ msoYftiIrow: 1 }}>
                  <td width={165} valign="top" style={{
                    width: '123.65pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    borderTop: 'none',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          Patrick C. Brennan, PhD
                      </span>
                      </span>
                    </p>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          CEO:<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>DetectED-X
                      </span>
                      </span>
                    </p>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          Professor and Chair, Diagnostic Imaging
                      </span>
                      </span>
                    </p>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          University of Sydney
                      </span>
                      </span>
                    </p>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          Mudgee,NSW, Australia
                        <span style={{ background: 'lime', msoHighlight: 'lime' }}>
                          </span>
                        </span>
                      </span>
                    </p>
                  </td>
                  <td width={127} valign="top" style={{
                    width: '95.35pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          N/A
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={331} valign="top" style={{
                    width: '248.5pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          Nothing to disclose
                      </span>
                      </span>
                    </p>
                  </td>
                </tr>
                <tr style={{ msoYftiIrow: 4 }}>
                  <td width={623} colSpan={3} valign="top" style={{
                    width: '467.5pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    borderTop: 'none',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    background: 'gray',
                    msoBackgroundThemecolor: 'background1',
                    msoBackgroundThemeshade: 128,
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" align="center" style={{ marginBottom: '.0001pt', textAlign: 'center', lineHeight: 'normal' }}>
                      <span>
                        <b style={{ msoBidiFontWeight: 'normal' }}>
                          <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'white', msoThemecolor: 'background1' }}>
                            PLANNER DISCLOSURES
                        </span>
                        </b>
                      </span>
                    </p>
                  </td>
                </tr>
                <tr style={{ msoYftiIrow: 5 }}>
                  <td width={165} valign="top" style={{
                    width: '123.65pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    borderTop: 'none',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          Dorothy Caputo, MA, BSN, RN - CE Director of
                          Accreditations
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={127} valign="top" style={{
                    width: '95.35pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          N/A
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={331} valign="top" style={{
                    width: '248.5pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          Nothing to disclose
                      </span>
                      </span>
                    </p>
                  </td>
                </tr>
                <tr style={{ msoYftiIrow: 6 }}>
                  <td width={165} valign="top" style={{
                    width: '123.65pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    borderTop: 'none',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          DetectED-X Staff and Planners
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={127} valign="top" style={{
                    width: '95.35pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          N/A
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={331} valign="top" style={{
                    width: '248.5pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          Nothing to disclose
                      </span>
                      </span>
                    </p>
                  </td>
                </tr>
                <tr style={{ msoYftiIrow: 7, msoYftiLastrow: 'yes' }}>
                  <td width={165} valign="top" style={{
                    width: '123.65pt',
                    border: 'solid black 1.0pt',
                    msoBorderThemecolor: 'text1',
                    borderTop: 'none',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', msoLayoutGridAlign: 'none', textAutospace: 'none' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif' }}>
                          AKH Planners and Reviewers
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={127} valign="top" style={{
                    width: '95.35pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          N/A
                      </span>
                      </span>
                    </p>
                  </td>
                  <td width={331} valign="top" style={{
                    width: '248.5pt',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: 'solid black 1.0pt',
                    msoBorderBottomThemecolor: 'text1',
                    borderRight: 'solid black 1.0pt',
                    msoBorderRightThemecolor: 'text1',
                    msoBorderTopAlt: 'solid black .5pt',
                    msoBorderTopThemecolor: 'text1',
                    msoBorderLeftAlt: 'solid black .5pt',
                    msoBorderLeftThemecolor: 'text1',
                    msoBorderAlt: 'solid black .5pt',
                    msoBorderThemecolor: 'text1',
                    padding: '0cm 5.4pt 0cm 5.4pt'
                  }}>
                    <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
                      <span>
                        <span style={{ fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                          Nothing to disclose
                      </span>
                      </span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal', background: 'white' }}>
              <span />
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><b><span
                style={{
                  fontSize: '10.0pt',
                  fontFamily: '"Arial",sans-serif',
                  msoFareastFontFamily: '"Times New Roman"',
                  color: '#333333'
                }}>Criteria for Success</span></b></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  <br />
                Statements of credit will be awarded based on participation in the posttest and
                submission of the activity evaluation form.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  A passing score of 75% on the posttest is required to receive a
                  statement of credit.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>If you have questions about this CME activity, please contact
                AKH Inc. at&nbsp;</span></span><a href="mailto:kwolynski@akhcme.com"><span><span
                style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"' }}>kwolynski@akhcme.com</span></span></a>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  .
                <b>
                    <span style={{ msoNoProof: 'yes' }}>
                    </span>
                  </b>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333', msoNoProof: 'yes' }}>
                  </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b style={{ msoBidiFontWeight: 'normal' }}>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333', msoNoProof: 'yes' }}>
                  </span>
                </b>
              </span>
              <span><b><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}><span
                style={{ msoSpacerun: 'yes' }}>&nbsp;</span></span></b></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  CME<a name="_Hlk507681674"> Credit provided by AKH Inc., Advancing Knowledge in
                  Healthcare</a><br />
                  <br />
                  <b>Physicians</b><br />
                This activity has been planned and implemented in accordance with the
                accreditation requirements and policies of the Accreditation Council for
                Continuing Medical Education (ACCME) through the joint providership of AKH
                Inc., Advancing Knowledge in Healthcare and Practice Profitability MD. AKH Inc.,
                Advancing Knowledge in Healthcare is accredited by the Accreditation Council
                for Continuing Medical Education (ACCME) to provide continuing medical
                education for physicians.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  <br />
                AKH Inc., Advancing Knowledge in Healthcare designates each live activity for a
                maximum of {credit} <i>AMA PRA Category 1 Credit(s)™</i>. Physicians should claim
                only the credit commensurate with the extent of their participation in the
                activity.<br />
                  <br />
                  <b>Physician Assistants</b><br />
                NCCPA accepts A<i>MA PRA Category 1&nbsp;Credit™</i>&nbsp;from organizations
                accredited by ACCME.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><b><span
                style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>Commercial Support</span></b></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  <br />
                There is no commercial support for this activity.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: '#333333' }}>
                  </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b style={{ msoBidiFontWeight: 'normal' }}>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif' }}>
                    Disclosures
                </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                  It is the policy of AKH Inc. to ensure independence, balance,
                  objectivity, scientific rigor, and integrity in all of its continuing education
                  activities. The author must disclose to the participants any significant
                  relationships with commercial interests whose products or devices may be
                  mentioned in the activity or with the commercial supporter of this continuing
                  education activity. Identified conflicts of interest are resolved by AKH prior
                  to accreditation of the activity and may include any of or combination of the
                  following: attestation to non-commercial content; notification of independent
                  and certified CME expectations; referral to National Author Initiative
                  training; restriction of topic area or content; restriction to discussion of
                  science only; amendment of content to eliminate discussion of device or
                  technique; use of other author for discussion of recommendations; independent
                  review against criteria ensuring evidence support recommendation; moderator
                  review; and peer review.&nbsp;
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <b>
                  <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                  </span>
                </b>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span><b><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>Disclosure of Unlabeled Use and Investigational Product <br />
              </span></b></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                  This educational activity may include discussion
                  of uses of agents that are investigational and/or unapproved by the FDA. Please
                  refer to the official prescribing information for each product for discussion
                  of approved indications, contraindications, and warnings.
              </span>
              </span>
            </p>
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                </span>
              </span>
            </p>
            <p className="MsoListParagraph" style={{ margin: '0cm', marginBottom: '.0001pt', msoAddSpace: 'auto', lineHeight: 'normal' }}>
              <span><b><span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>Disclaimer <br />
              </span></b></span>
              <span>
                <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', msoFareastFontFamily: '"Times New Roman"', color: 'black' }}>
                  This course is designed solely to provide the
                  healthcare professional with information to assist in his/her practice and
                  professional development and is not to be considered a diagnostic tool to
                  replace professional advice or treatment. The course serves as a general guide
                  to the healthcare professional, and therefore, cannot be considered as giving
                  legal, nursing, medical, or other professional advice in specific cases. AKH Inc.
                  specifically disclaim responsibility for any adverse consequences resulting
                  directly or indirectly from information in the course, for undetected error, or
                  through participant's misunderstanding of the content.
              </span>
              </span>
            </p>
            <span />
            <p className="MsoNormal" style={{ marginBottom: '.0001pt', lineHeight: 'normal' }}>
              <span style={{ fontSize: '10.0pt', fontFamily: '"Arial",sans-serif' }}>
              </span>
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  )
}