// Under Review

"use client";

import React from "react";

interface TabProps {
  activeTab: string;
  "page-label": string;
  onClick: (label: string) => void;
}

class Tab extends React.Component<TabProps> {
  onClick = () => {
    const { "page-label": dataLabel, onClick } = this.props;
    onClick(dataLabel);
  };

  render() {
    const {
      onClick,
      props: { activeTab, "page-label": dataLabel },
    } = this;

    let className = "tab-list-item";

    if (activeTab === dataLabel) {
      className += " tab-list-active";
    }

    return (
      <li className={className} onClick={onClick}>
        {dataLabel === "affirmation" && (
          <a className="footer-link">
            <span className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm6-8A6,6,0,0,1,6,13a1,1,0,0,1,2,0,4,4,0,0,0,8,0,1,1,0,0,1,2,0ZM8,10V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Zm6,0V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Z" />
              </svg>
            </span>
            <div style={{ fontSize: "12px" }}>Affirmation</div>
          </a>
        )}

        {dataLabel === "nametag" && (
          <a className="footer-link">
            <span className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
              </svg>
            </span>
            <div style={{ fontSize: "12px" }}>Name Tag</div>
          </a>
        )}

        {dataLabel === "mindfulness" && (
          <a className="footer-link">
            <span className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40.914"
                height="48"
              >
                <g>
                  <path d="M32.348 35.063a19.509 19.509 0 0 0-4.412.635 25.566 25.566 0 0 1-1.192-5.225 4.269 4.269 0 0 0 1.837.475h.155c2.895-.135 6.344-2.088 6.344-10.635a6.706 6.706 0 0 0-3.39-5.8c-2.072-1.254-4.6-1.5-6.22-.647a14.12 14.12 0 0 1-9.945.036 6.726 6.726 0 0 0-6.3.611 6.707 6.707 0 0 0-3.391 5.8c0 8.547 3.45 10.5 6.345 10.635h.155a4.215 4.215 0 0 0 1.753-.432 26 26 0 0 1-1.177 5.164 19.363 19.363 0 0 0-4.343-.617C3.839 35.063 0 41.409 0 45.549a1.915 1.915 0 0 0 .958 1.656 8.584 8.584 0 0 0 4.31.8 54.2 54.2 0 0 0 15.4-2.777c3.611 1.469 15.769 3.277 19.174 1.111a2.052 2.052 0 0 0 1.07-1.777c.005-4.279-3.949-9.499-8.564-9.499zm-20-5.571h-.094c-3.289-.152-4.957-3.242-4.957-9.182a5.27 5.27 0 0 1 2.688-4.559 5.368 5.368 0 0 1 4.95-.531l.094.037a15.567 15.567 0 0 0 11.042-.072 5.339 5.339 0 0 1 4.871.566 5.271 5.271 0 0 1 2.688 4.559c0 5.939-1.667 9.027-4.954 9.182h-.1c-2.762 0-6.322-5.539-7.472-7.7-.011-.021-.031-.033-.044-.053a.64.64 0 0 0-.091-.111.841.841 0 0 0-.113-.094c-.019-.012-.1-.053-.117-.063a.722.722 0 0 0-.146-.043.693.693 0 0 0-.128-.012.578.578 0 0 0-.143.014.638.638 0 0 0-.135.041c-.022.01-.1.051-.122.064a.636.636 0 0 0-.11.09.717.717 0 0 0-.093.113c-.013.02-.032.031-.043.053-1.153 2.162-4.713 7.701-7.474 7.701zm14.183 6.59a22.18 22.18 0 0 0-4.508 1.852 3.135 3.135 0 0 1-3.122 0 22.212 22.212 0 0 0-4.574-1.873 27.623 27.623 0 0 0 1.345-6.545 23.335 23.335 0 0 0 4.791-5.908 23.518 23.518 0 0 0 4.71 5.844 27.587 27.587 0 0 0 1.355 6.63zm12.538 9.024c-2.393 1.523-11.619.533-16.193-.7a15.4 15.4 0 0 1 3.583-.727.728.728 0 0 0-.021-1.455h-.019a18.153 18.153 0 0 0-5.737 1.42 18.158 18.158 0 0 0-5.737-1.42h-.019a.728.728 0 0 0-.021 1.455 15.517 15.517 0 0 1 3.617.738c-4.751 1.414-14.474 3.053-16.766 1.564-.3-.191-.3-.35-.3-.436 0-3.484 3.256-9.031 7.114-9.031a23.2 23.2 0 0 1 9.6 2.676 4.6 4.6 0 0 0 4.576 0 22.849 22.849 0 0 1 9.6-2.676c3.765 0 7.113 4.5 7.113 8.039.003.094.003.301-.393.553z" />
                  <path d="M14.468 18.7a.728.728 0 0 0-1.38.465 24.072 24.072 0 0 1 1.193 6.248.727.727 0 0 0 .726.684h.044a.728.728 0 0 0 .684-.77 25.525 25.525 0 0 0-1.267-6.627zM25.793 26.106a.324.324 0 0 0 .044 0 .729.729 0 0 0 .726-.686 24.049 24.049 0 0 1 1.193-6.256.728.728 0 0 0-1.379-.465 25.527 25.527 0 0 0-1.268 6.635.728.728 0 0 0 .684.772zM20.51 12.909c3.377 0 5.9-3.993 5.9-7.563 0-3.4-2.15-5.346-5.9-5.346s-5.9 1.948-5.9 5.346c-.001 3.57 2.523 7.563 5.9 7.563zm0-11.454c2.95 0 4.445 1.309 4.445 3.891 0 3.14-2.161 6.108-4.445 6.108s-4.446-2.969-4.446-6.108c0-2.583 1.496-3.891 4.446-3.891z" />
                </g>
              </svg>
            </span>
            <div style={{ fontSize: "12px" }}>Mindfulness</div>
          </a>
        )}

        {dataLabel === "wave-hands" && (
          <a className="footer-link">
            <span className="icon-container">
              <svg
                height="32px"
                width="32px"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 487.582 487.582"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M472.936,200.703c-5.177-5.177-11.293-9.069-17.959-11.538c13.349-19.462,11.398-46.338-5.88-63.617
                      c-5.425-5.425-11.799-9.336-18.592-11.742c4.674-7.716,7.175-16.583,7.175-25.836c0-13.356-5.201-25.912-14.646-35.355
                      c-9.443-9.444-21.999-14.645-35.355-14.645c-9.253,0-18.12,2.501-25.836,7.175c-2.406-6.792-6.316-13.167-11.741-18.592
                      c-19.496-19.494-51.217-19.495-70.711,0l-86.405,86.405c-2.481-6.326-6.251-12.135-11.2-17.084
                      c-9.444-9.444-22-14.645-35.355-14.645s-25.912,5.201-35.355,14.645L38.369,168.58C13.626,193.323,0,226.22,0,261.211
                      s13.626,67.888,38.369,92.631l83.438,83.438c24.742,24.743,57.639,38.37,92.63,38.37s67.889-13.626,92.631-38.37l165.867-165.866
                      c9.444-9.444,14.646-22,14.646-35.356C487.582,222.703,482.38,210.147,472.936,200.703z M451.723,250.201L285.856,416.067
                      c-19.076,19.077-44.44,29.583-71.418,29.583c-26.978,0-52.341-10.506-71.417-29.583l-83.438-83.438
                      c-39.38-39.38-39.38-103.456,0-142.836l72.707-72.706c3.777-3.777,8.799-5.858,14.142-5.858s10.364,2.081,14.142,5.858
                      c3.777,3.777,5.858,8.799,5.858,14.142s-2.081,10.364-5.858,14.142c0,0-56.568,56.569-56.568,56.569l21.213,21.213L300.604,47.766
                      c7.798-7.798,20.487-7.798,28.285,0s7.798,20.486,0,28.285L217.141,187.798l21.213,21.213L373.538,73.828
                      c3.777-3.777,8.8-5.858,14.142-5.858c5.343,0,10.365,2.081,14.143,5.858c3.777,3.777,5.858,8.8,5.858,14.142
                      c0,5.342-2.081,10.364-5.858,14.142l-23.426,23.426c-0.01,0.01-111.758,111.758-111.758,111.758l21.213,21.213l111.748-111.748
                      c7.798-7.798,20.487-7.798,28.285,0s7.798,20.487,0,28.285l-25.65,25.65c-0.008,0.008-86.098,86.097-86.098,86.097l21.213,21.213
                      l86.094-86.094c3.777-3.775,8.798-5.854,14.138-5.854c5.343,0,10.365,2.081,14.143,5.858c3.777,3.777,5.858,8.8,5.858,14.142
                      C457.582,241.4,455.5,246.423,451.723,250.201z"
                  />
                </g>
              </svg>
            </span>
            <div style={{ fontSize: "12px" }}>Wave Hands</div>
          </a>
        )}
      </li>
    );
  }
}

export default Tab;
