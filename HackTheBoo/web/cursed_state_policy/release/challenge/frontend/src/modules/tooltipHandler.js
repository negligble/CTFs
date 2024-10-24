import { Tooltip } from 'bootstrap';

export function setCSPTooltip(type) {
  const cspIcon = document.getElementById('cspIcon');
  
  let tooltipText, iconClass;

  if (type === 'default') {
    tooltipText = 'This is the default CSP from the server.';
    iconClass = 'ms-3 material-icons text-secondary';
  } else if (type === 'safe') {
    tooltipText = 'This is a sample safe policy with strong security configurations.';
    iconClass = 'ms-3 material-icons text-success';
  } else if (type === 'unsafe') {
    tooltipText = 'This is a sample unsafe policy with insecure directives.';
    iconClass = 'ms-3 material-icons text-danger';
  }

  cspIcon.setAttribute('title', tooltipText);
  cspIcon.className = iconClass;

  new Tooltip(cspIcon);
}