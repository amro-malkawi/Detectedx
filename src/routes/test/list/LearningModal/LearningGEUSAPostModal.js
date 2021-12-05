import React from 'react';
import {Dialog} from "@material-ui/core";

export default function (props) {
    return (
        <Dialog open={props.open} onClose={props.onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
            <div style={{padding: 30, height: '100%', overflow: 'auto'}}>
                <div lang="EN-US" link="blue" vlink="#954F72" style={{wordWrap: 'break-word'}}>
                    <div className="WordSection1">
                        <p className="MsoNormal" align="center" style={{marginBottom: '0in', textAlign: 'center', lineHeight: 'normal'}}><a name="_Hlk481069507"><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black', background: 'white'}}>DetectED-X</span></b></a></p>
                        <p className="MsoNormal" align="center" style={{marginBottom: '0in', textAlign: 'center', lineHeight: 'normal'}}><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>Interactive
              mammogram interpretation to improve breast cancer detection - module </span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>{props.name}</span><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', background: 'lime'}}><br/>
            </span><b><span style={{fontSize: '9.0pt', fontFamily: '"Arial",sans-serif'}}>01 July
                2021- 30 June 2022</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}><br/>
              <b>Program Overview</b><br/>
            </span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>This
              educational activity based on radiologic test sets and an interactive platform
              are designed to improve the diagnostic efficacy of radiologists and other
              clinicians. Each individual will be asked to assess clinically relevant tomographic
              images and try to identify a cancer (if one is present) and recognize images
              without cancer.&nbsp; Each individual will receive immediate feedback with
              scores for sensitivity, specificity and receiver operating characteristic
              (ROC). Personalized image files for each case judged will then be instantly
              provided showing correct decisions and any errors made.&nbsp; At the end there
              will be an {props.postTestCount}-image posttest and if passed a CME certificate will be issued. </span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}><br/>
              <b>Target Audience</b><br/>
            </span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>This
              activity is designed to meet the needs of physicians and other health care professionals
              involved in judging radiologic images.<span style={{color: '#333333'}}><br/>
                <br/>
                <b>Learning Objectives</b><br/>
                Upon completion of the educational activity, participants should be able to:</span></span></p>
                        <p className="MsoListParagraphCxSpFirst"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>At the end of this module, the user will be able to</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Recognise a range of cancer appearances demonstrated in the image
              learning set and therefore maximise cancer detection;</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Be aware of the range of appearances of images without cancer and
              therefore minimise unnecessary call-backs;</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Improve perception and interpretation skills in the reading of
              digital tomographic images;</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Demonstrate an awareness of any personal weaknesses when searching
              for cancers or trying to recognise normal images;</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Assess detailed scores on personal performance levels using 5
              internationally recognised metrics;</span></p>
                        <p className="MsoListParagraphCxSpMiddle"
                           style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', textIndent: '-.25in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: 'Symbol'}}>·<span style={{font: '7.0pt "Times New Roman"'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span></span><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Demonstrate increased confidence when interpreting radiologic
              images.</span></p>
                        <p className="MsoListParagraphCxSpLast" style={{marginTop: '0in', marginRight: '0in', marginBottom: '0in', marginLeft: '.75in', lineHeight: 'normal', background: 'white'}}>
                            <span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>&nbsp;</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>Activity
                is jointly-provided by AKH Inc., Advancing Knowledge in Healthcare and DetectED-X.</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span
                            style={{fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>&nbsp;</span></b></p>
                        <table className="MsoTableGrid" border={1} cellSpacing={0} cellPadding={0} style={{borderCollapse: 'collapse', border: 'none'}}>
                            <tbody>
                            <tr>
                                <td width={623} colSpan={3} valign="top" style={{width: '467.5pt', border: 'solid black 1.0pt', background: 'gray', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" align="center" style={{marginBottom: '0in', textAlign: 'center', lineHeight: 'normal', textAutospace: 'none'}}><b><span
                                        style={{fontSize: '9.0pt', fontFamily: '"Arial",sans-serif', color: 'white'}}>FACULTY DISCLOSURES</span></b></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Patrick C.
                      Brennan, PhD</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>CEO:&nbsp;
                                        DetectED-X</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Professor
                      and Chair, Diagnostic Imaging</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>University
                      of Sydney</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Mudgee,NSW,
                      Australia</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Mary T
                      Rickard, MB BS BSc(Med) FRANZCR DDU MPH</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Founder,
                      DetectED-X</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Consultant
                      Radiologist ,Breas tScreen &nbsp;NSW &nbsp;Adjunct Professor, Medical Imaging</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>University
                      of Sydney</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Centennial
                      Park, NSW, Australia</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Mo'ayyad
                      E. Suleiman, PhD</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>CTO at
                      DetectED-X</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Post
                      Doctoral fellow</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>University
                      of Sydney</span></p>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Padstow,
                      NSW, Australia</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={623} colSpan={3} valign="top" style={{width: '467.5pt', border: 'solid black 1.0pt', borderTop: 'none', background: 'gray', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" align="center" style={{marginBottom: '0in', textAlign: 'center', lineHeight: 'normal'}}><b><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'white'}}>PLANNER DISCLOSURES</span></b></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>Dorothy
                      Caputo, MA, BSN, RN - CE Director of Accreditations</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>DetectED-X
                      Staff and Planners</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td width={165} valign="top" style={{width: '123.65pt', border: 'solid black 1.0pt', borderTop: 'none', padding: '0in 5.4pt 0in 5.4pt'}}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', textAutospace: 'none'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif'}}>AKH
                      Planners and Reviewers</span></p>
                                </td>
                                <td width={127} valign="top" style={{
                                    width: '95.35pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                                        style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>N/A</span></p>
                                </td>
                                <td width={331} valign="top" style={{
                                    width: '248.5pt',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderBottom: 'solid black 1.0pt',
                                    borderRight: 'solid black 1.0pt',
                                    padding: '0in 5.4pt 0in 5.4pt'
                                }}>
                                    <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '8.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Nothing to
                      disclose</span></p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal', background: 'white'}}><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>&nbsp;</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>Criteria
                for Success</span></b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}><br/>
              Statements of credit will be awarded based on participation in the posttest and
              submission of the activity evaluation form. </span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>A passing
              score of 75% on the posttest is required to receive a statement of credit.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>&nbsp;</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>If you
              have questions about this CME activity, please contact AKH Inc. at&nbsp;</span><a href="mailto:kwolynski@akhcme.com"><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>kwolynski@akhcme.com</span></a><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>&nbsp;</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>
                <img border={0} width={94} height={33} id="Picture 4" src={require('Assets/img/akh_logo.jpg')}
                     alt=""/></span></b><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>&nbsp;</span></b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>CME<a name="_Hlk507681674"> Credit provided by AKH Inc., Advancing Knowledge in
                Healthcare</a><br/>
              <br/>
              <b>Physicians</b><br/>
              This activity has been planned and implemented in accordance with the accreditation
              requirements and policies of the Accreditation Council for Continuing Medical
              Education (ACCME) through the joint providership of AKH Inc., Advancing
              Knowledge in Healthcare and Practice Profitability MD. AKH Inc., Advancing
              Knowledge in Healthcare is accredited by the Accreditation Council for
              Continuing Medical Education (ACCME) to provide continuing medical education
              for physicians.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}><br/>
              AKH Inc., Advancing Knowledge in Healthcare designates each live activity for a
              maximum of {props.credit} <i>AMA PRA Category 1 Credit(s)™</i>. Physicians should claim
              only the credit commensurate with the extent of their participation in the
              activity.<br/>
              <br/>
              <b>Physician Assistants</b><br/>
              NCCPA accepts A<i>MA PRA Category 1&nbsp;Credit™</i>&nbsp;from organizations
              accredited by ACCME.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>&nbsp;</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>Commercial
                Support</span></b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}><br/>
              There is no commercial support for this activity.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: '#333333'}}>&nbsp;</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>Disclosures</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>It is the
              policy of AKH Inc. to ensure independence, balance, objectivity, scientific
              rigor, and integrity in all of its continuing education activities. The author
              must disclose to the participants any significant relationships with commercial
              interests whose products or devices may be mentioned in the activity or with
              the commercial supporter of this continuing education activity. Identified
              conflicts of interest are resolved by AKH prior to accreditation of the
              activity and may include any of or combination of the following: attestation to
              non-commercial content; notification of independent and certified CME
              expectations; referral to National Author Initiative training; restriction of
              topic area or content; restriction to discussion of science only; amendment of
              content to eliminate discussion of device or technique; use of other author for
              discussion of recommendations; independent review against criteria ensuring
              evidence support recommendation; moderator review; and peer review.&nbsp; </span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>&nbsp;</span></b></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Disclosure
                of Unlabeled Use and Investigational Product <br/>
              </span></b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>This educational activity may include discussion of uses of agents
              that are investigational and/or unapproved by the FDA. Please refer to the
              official prescribing information for each product for discussion of approved indications,
              contraindications, and warnings. </span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>&nbsp;</span>
                        </p>
                        <p className="MsoListParagraph" style={{margin: '0in', lineHeight: 'normal'}}><b><span
                            style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>Disclaimer <br/>
              </span></b><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif', color: 'black'}}>This course is designed solely to provide the healthcare
              professional with information to assist in his/her practice and professional
              development and is not to be considered a diagnostic tool to replace
              professional advice or treatment. The course serves as a general guide to the
              healthcare professional, and therefore, cannot be considered as giving legal,
              nursing, medical, or other professional advice in specific cases. AKH Inc.
              specifically disclaim responsibility for any adverse consequences resulting
              directly or indirectly from information in the course, for undetected error, or
              through participant's misunderstanding of the content.</span></p>
                        <p className="MsoNormal" style={{marginBottom: '0in', lineHeight: 'normal'}}><span style={{fontSize: '10.0pt', fontFamily: '"Arial",sans-serif'}}>&nbsp;</span></p>
                    </div>
                </div>
            </div>
        </Dialog>
)
}