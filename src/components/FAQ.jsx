import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FAQ = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Preguntas Frecuentes</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 prose prose-lg">
          <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: answer }}></p>
        </div>
      )}
    </div>
  );
};

const faqs = [
  {
    question: "¿Cuál es la diferencia entre actividades y carreras de posgrado?",
    answer:
      "Las actividades de postgrado están destinadas a la capacitación, actualización y/o el perfeccionamiento de profesionales, docentes y/o investigadores, dentro de un área temática.<br/><br/>Las carreras de posgrado permiten obtener los títulos de Doctor, Magíster y Especialista, dentro de una disciplina, y requieren de la realización de un trabajo final, obra o tesis de posgrado.",
  },
  {
    question: "¿Qué diferencia existe entre especialización, maestría y doctorado?",
    answer:
      "Según Ordenanza de Consejo Superior 0600/2014:<br/><br/>Especialización. Tiene por objeto profundizar en el dominio de  un tema o área determinada dentro de una profesión, o de un campo de aplicación de varias profesiones, perfeccionando la capacitación profesional mediante la adquisición de conocimientos actualizados a través de un programa de estudios que puede incluir diversas actividades educativas. Las carreras de especialización tienen una duración mínimas de 360 horas reloj de clases dictadas, a las que se debe adicionar un trabajo final integrador de carácter individual.<br/><br/>Maestría. Tiene por objeto brindar una formación amplia en una disciplina o área interdisciplinaria, proporcionando conocimientos avanzados y profundizando en los aspectos metodológicos y profesionales, promoviendo el ejercicio de la crítica y de la creatividad dentro de dicha disciplina o área interdisciplinaria, a través de un programa de estudios que puede incluir diversas actividades educativas.  Las carreras de Maestría tienen al menos 700 horas reloj de las cuales un mínimo de 540 horas  destinadas a cursos, seminarios y otras actividades de esa índole y las restante podrán ser asignadas al trabajo final u otras actividades complementarias.</br></br>Doctorado. Tiene por objeto la brindar preparación para la investigación original capaz de generar aportes significativos y universales al acervo de conocimientos en un área disciplinar específica.  La primer etapa  apunta al dominio del campo de conocimiento, la identificación de potenciales temas de investigación y la elaboración de hipótesis a través de diversas actividades educativas. La segunda etapa consiste en llevar a la práctica un proyecto de investigación, la tesis doctoral, que deberá aportar conclusiones válidas que constituyan aportes relevantes al respectivo campo de conocimiento.",
  },
  {
    question: "¿Cual es el nombre correcto de las carreras y de los títulos que otorgan?",
    answer:
      "CARRERA: Doctorado en Ciencia de Materiales.<br/>TÍTULO: Doctor en Ciencia de Materiales<br/><br/>CARRERA: Maestría en Ciencia y Tecnología de Materiales.<br/>TÍTULO: Magister en Ciencia y Tecnología de Materiales",
  },
  {
    question: "¿Qué es el sistema de Unidades Valorativas Académicas (UVAC)?",
    answer:
      "Una UVAC equivale a:<br/>a) 12 horas de clases teóricas,<br/>b) 36 horas de clases prácticas, o<br/>c) 24 horas de clases teórico-prácticas cuando la teoría no puede separarse de la práctica.",
  },
  {
    question: "¿Qué documentación se debe presentar para la inscripción?",
    answer:
      "Se debe presentar a la Secretaria de Posgrado firmada:<br/>- Planilla de inscripción firmada (por duplicado)<br/>- Certificado analítico (copia fiel)<br/>- Copia del título de grado (copia fiel)<br/>- Curriculum vitae <br/>- Copia del plan de trabajo (con el formato de las presentaciones para CONICET o UNIVERSIDAD) avalado por la Comisión de Seguimiento.",
  },

  {
    question: "¿Qué documentación adicional deben presentar los estudiantes extranjeros?",
    answer:
      "Los estudiantes extranjeros deben convalidar sus títulos previo a la inscripción.<br/>Los documentos deben contar con la Apostilla de La Haya de su país de origen, lo cual suprime la exigencia de legalización por Cancillería argentina.",
  },
  {
    question: "¿Cuándo debo presentar el informe anual y en qué consiste?",
    answer: "Consultar el cronograma y modelo de informe anual",
  },
  {
    question: "¿Qué se evalúa en la defensa oral del plan de trabajo (pretesis)?",
    answer:
      "En la defensa oral y pública del plan de trabajo definitivo (pretesis) la Comisión de Seguimiento evaluará: la calidad y significación de las actividades, la factibilidad de desarrollarlas en este medio, las dificultades encontradas, el grado de cumplimiento del plan de trabajo, etc.; de modo de calificar el rendimiento y calidad del tesista en función de los progresos que éste haya manifestado y los juicios que haya emitido. </br>Las respuestas en la defensa pública del proyecto, estarán a cargo exclusivamente del candidato. El Director y Codirector podrán estar presentes en la defensa oral del Plan de Trabajo, y responder sólo una vez que se haya completado la defensa pública, aclarando y explicando las respuestas o respondiendo preguntas de interés general que la Comisión le hiciera a él específicamente.</br>En caso de desaprobación de la defensa la CAP podrá ofrecer una segunda oportunidad, si lo considera oportuno y en un plazo fijado por ella.</br>El tercer informe anual debe incluir:</br>- Plan de trabajo definitivo</br>- Título definitivo de tesis</br>- Estado del conocimiento del tema</br>- Originalidad y significación del plan propuesto</br>- Resumen de principales resultados obtenidos hasta el momento</br>- Cursos tomados y sus calificaciones",
  },
  {
    question:
      "¿Qué documentación se debe presentar para reconocer un curso tomado fuera de la oferta de cursos del posgrado en Ciencia de Materiales?",
    answer:
      "Una vez tomado el curso se debe presentar la siguiente documentación: </br>. Nota dirigida al Director de Posgrado solicitando el reconocimiento del curso y fundamentando su inclusión en el plan de estudios del tesista, firmada por el tesista, director y miembros de la comisión de seguimiento. En la nota se debe fundamentar la necesidad de la inclusión del curso en el plan de estudios del tesista.</br>- Programa del curso, carga horaria discriminada en clases teóricas, clases prácticas o clases teórico-prácticas, modalidad de examen, CV de los docentes y certificado de aprobación firmado por máxima autoridad de la institución (secretario académico, de posgrado, decano, vice-decano, rector, director).</br>- Si se trata de un curso de grado, adjuntar a la solicitud: programa del curso, carga horaria discriminada en clases teóricas, clases prácticas o clases teórico-prácticas, calificación obtenida (acta elevada por el docente).",
  },
  {
    question: "¿Que carga horaria se reconoce por un un curso tomado fuera de la oferta de cursos del posgrado?",
    answer:
      "El reconocimiento de la carga horaria de un curso determinado tomado fuera de la oferta de cursos lo realiza la Comisión Académica de Posgrado en base al criterio propio, teniendo en cuenta la documentación presentada, no solamente se tiene en cuenta la cantidad de horas, si no el alcance del curso, los contenidos, el aspecto formativo, etc.",
  },
  {
    question: "¿Qué documentación debe presentar un docente para ofrecer el dictado de un curso de posgrado?",
    answer:
      "1) Nota de ofrecimiento del curso dirigida a la Secretaría de Investigación y Posgrado (ver modelo en sección formularios), tanto para cursos dictados por personal de la UNMdP como por docentes externos. En este último caso, se requiere siempre de un docente responsable local. </br></br>2) Documento firmado con el siguiente contenido:</br>- Nombre del curso</br>- Nombre del docente que dicta el curso</br>- Nombre del docente responsable del curso</br>- Carga horaria: clases teóricas, prácticas y/o teórico-prácticas (considerando que 1 UVAC = 12 h)</br>- Fecha estimada del dictado del curso</br>- Modalidad</br>- Profesionales a los que está destinado el curso</br>- Descripción y objetivos del curso</br>- Material básico requerido para el curso</br>- Programa</br>- Evaluación</br>- Bibliografía",
  },
  {
    question: "¿Cómo y cuándo se solicita la constitución de un tribunal de tesis doctoral o de maestría?",
    answer:
      "El director debe solicitarlo con 5 meses de anticipación a la defensa.<br/><br/>Para doctorado se requieren 2 jurados externos a UNMdP, 2 externos al programa y 1 miembro de la CDS.<br/><br/>Para maestría se necesitan 2 jurados externos a UNMdP y 3 miembros de la CDS.<br/><br/>La CAP determina la conformación final del tribunal.",
  },
];

export default FAQ;
