export default (key, name, type) => {
  if (!type) type = 'flowable'
  const TYPE_TARGET = {
    activiti: 'http://activiti.org/bpmn',
    camunda: 'http://bpmn.io/schema/bpmn',
    flowable: 'http://flowable.org/bpmn'
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://flowable.org/test" exporter="Flowable Open Source Modeler" exporterVersion="1.1.1-SNAPSHOT">
    <process id="${key}" name="${name}" isExecutable="true">
      <startEvent id="startEvent1" />
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_${key}">
      <bpmndi:BPMNPlane id="BPMNPlane_${key}" bpmnElement="${key}">
        <bpmndi:BPMNShape id="BPMNShape_startEvent1" bpmnElement="startEvent1">
          <omgdc:Bounds x="485" y="165" width="30" height="30" />
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </definitions>`
}
