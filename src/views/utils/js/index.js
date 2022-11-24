console.log({test:/note\/getNotes\/[0-9]{0,}\/[0-9]{0,}/.test(window.location.pathname)});

if (/note\/getNotes\/[0-9]{0,}\/[0-9]{0,}/.test(window.location.pathname) ||

/user\/getNotes\/user\/[0-9]{24}\/[0-9]{0,}\/[0-9]{0,}/.test(window.location.pathname)
|| /user\/Notes\/[0-9]{0,}\/[0-9]{0,}/.test(window.location.pathname)) {
    document
      .querySelector(`a[href="${window.location.pathname}"]`)
      .parentElement.classList.add("active");
  }
 
 