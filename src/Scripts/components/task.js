export default function Task(category, title_content, content, time) {
  return (
    `<li>
      <div class="top_section">
        <div class="title">
          <div class="category">${category}</div>
          <div class="title_content">${title_content}</div>
        </div>
        <div class="edit">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class = 'Edit'
          >
            <path
              d="M14.0263 20.7021H21.2789"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.0589 3.84291C13.8346 2.90415 15.2289 2.7665 16.1752 3.53601C16.2275 3.57776 17.9084 4.90015 17.9084 4.90015C18.9479 5.53652 19.2709 6.88937 18.6283 7.92178C18.5942 7.97707 9.09088 20.0151 9.09088 20.0151C8.77471 20.4145 8.29476 20.6504 7.78184 20.656L4.14246 20.7023L3.32246 17.1875C3.20759 16.6933 3.32246 16.1743 3.63863 15.7749L13.0589 3.84291Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.2997 6.07698L16.752 10.3172"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            class="Trash"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.6038 9.58827C19.6038 9.58827 19.0608 16.4087 18.7458 19.2817C18.5958 20.6538 17.7588 21.4579 16.3878 21.4832C13.7788 21.5308 11.1668 21.5339 8.55884 21.4782C7.23984 21.4508 6.41684 20.6366 6.26984 19.2887C5.95284 16.3905 5.41284 9.58827 5.41284 9.58827"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20.9871 6.31883H4.02911"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.7195 6.31883C16.9345 6.31883 16.2585 5.75679 16.1045 4.97804L15.8615 3.74662C15.7115 3.1785 15.2035 2.78558 14.6245 2.78558H10.3915C9.81251 2.78558 9.30451 3.1785 9.15451 3.74662L8.91151 4.97804C8.75751 5.75679 8.08151 6.31883 7.29651 6.31883"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="bottom_section">
        <div class="content">${content}</div>
        <div class="time">
          <div class="clock">
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.27893 3.00002V7.00002H10.2789M13.2789 7.00002C13.2789 7.78795 13.1237 8.56817 12.8222 9.29612C12.5207 10.0241 12.0787 10.6855 11.5216 11.2427C10.9644 11.7998 10.303 12.2418 9.57503 12.5433C8.84708 12.8448 8.06686 13 7.27893 13C6.491 13 5.71078 12.8448 4.98283 12.5433C4.25488 12.2418 3.59344 11.7998 3.03629 11.2427C2.47914 10.6855 2.03718 10.0241 1.73565 9.29612C1.43413 8.56817 1.27893 7.78795 1.27893 7.00002C1.27893 5.40872 1.91107 3.8826 3.03629 2.75738C4.16151 1.63216 5.68763 1.00002 7.27893 1.00002C8.87023 1.00002 10.3964 1.63216 11.5216 2.75738C12.6468 3.8826 13.2789 5.40872 13.2789 7.00002Z"
                stroke="#5A5C63"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="time_content">${time}</span>
        </div>
      </div>
    </li>`
  );
}
