{{flutter_js}}
{{flutter_build_config}}
_flutter.loader.load({
  config: { hostElement: document.getElementById('flutter_host') },
  serviceWorkerSettings: { serviceWorkerVersion: {{flutter_service_worker_version}} }
});
