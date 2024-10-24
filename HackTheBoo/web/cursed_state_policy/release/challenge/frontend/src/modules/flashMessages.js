const alerts = document.getElementById('alerts');

export function flash(message, level) {
    const alertId = `alert-${Date.now()}`;
    alerts.innerHTML += `
      <div id="${alertId}" class="alert alert-${level} alert-dismissible fade show" role="alert">
        <strong>${message}</strong>
        <button type="button" class="btn-close" aria-label="Close" onclick="document.getElementById('${alertId}').remove()"></button>
      </div>
    `;
  
    setTimeout(() => {
      const alertElement = document.getElementById(alertId);
      if (alertElement) {
        alertElement.remove();
      }
    }, 2800);
  }