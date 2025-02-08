import React from "react";

const About = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Sobre el Posgrado</h1>
        <section>
          {/* Imagen flotante para que el texto la rodee */}
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Laboratory"
            className="float-right rounded-lg shadow-lg md:w-1/2 w-full ml-4 mb-4 object-cover"
          />
          <div className="text-gray-600">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Objetivo</h3>
              <p>
                El objetivo general de nuestro posgrado es la formación de graduados universitarios de un alto nivel
                académico mediante la profundización del conocimiento en disciplinas particulares de la Ciencia de
                Materiales, promoviendo en el estudiante el desarrollo de rigurosos métodos de razonamiento y
                experimentación, tanto en la investigación científica como en la enseñanza superior.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Maestría</h3>
              <p>
                Tiene por objeto proporcionar una formación superior en una disciplina o área interdisciplinaria,
                profundizando la formación en el desarrollo teórico, tecnológico, profesional, para la investigación y
                el estado del conocimiento correspondiente a dicha disciplina o área interdisciplinaria. La formación
                incluye la realización de una tesis de carácter individual bajo la supervisión de un director y culmina
                con la evaluación por un jurado que incluye al menos un miembro externo a la institución. El trabajo
                final o tesis debe demostrar destreza en el manejo conceptual y metodológico correspondiente al estado
                actual del conocimiento en la o las disciplinas del caso. Conduce al otorgamiento de un título académico
                de Magister con especificación precisa de una disciplina o de un área interdisciplinaria.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Doctorado</h3>
              <p>
                Está orientado a la obtención de aportes originales en un área del conocimiento, a través de una tesis
                individual bajo la supervisión de un Director, evaluada por un jurado mayoritariamente externo,
                conduciendo al título de Doctor.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">
                Instituto de Investigaciones en Ciencia y Tecnología de Materiales (INTEMA)
              </h3>
              <p>
                El Instituto de Investigaciones en Ciencia y Tecnología de Materiales (INTEMA) es un instituto de
                investigación y desarrollo de tecnología con sede en la ciudad de Mar del Plata, dependiente de la
                Universidad Nacional de Mar del Plata (UNMdP) y del Consejo Nacional de Investigaciones Científicas y
                Técnicas (CONICET). El instituto fue fundado en el año 1982 a través de un convenio de cooperación entre
                la UNMdP y el CONICET y se encuentra localizado físicamente en el ámbito de la Facultad de Ingeniería.
                Los objetivos básicos de INTEMA consisten en llevar a cabo actividades de investigación relativas al
                conocimiento básico y contribuir al desarrollo tecnológico en el área de materiales; estudiar aspectos
                relacionados con la estructura, las propiedades, el procesamiento, la unión, la protección y la
                degradación de materiales; contribuir a la formación de investigadores y técnicos y a la enseñanza de
                grado y postgrado; y desarrollar y transferir tecnologías al medio productivo. El instituto está
                organizado sobre la base de seis áreas temáticas, con sus laboratorios y equipamiento específicos, en
                las que se llevan a cabo actividades de investigación, docencia de posgrado y extensión. Incluye también
                un área interdisciplinaria y un conjunto de laboratorios y talleres que brindan servicios técnicos de
                apoyo. La mayoría de los investigadores del INTEMA desarrollan funciones docentes de grado en las
                carreras de Ingeniería en Materiales, Mecánica y Química, Electrónica y/o de posgrado en Ciencia de
                Materiales.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Nuevas tendencias en educación en Ciencia de Materiales</h3>
              <p>
                Las iniciativas del INTEMA y la Facultad de Ingeniería permitieron la creación del Magíster en Ciencia y
                Las actividades de investigación y formación propias del INTEMA y de la Facultad de Ingeniería llevaron
                a la creación en el ámbito de la Facultad de Ingeniería de la UNMdP de la carrera de Magister en Ciencia
                y Tecnología de Materiales (1983) (OCA 66/83 y OCS 456/83) y del Doctorado en Ciencia de Materiales
                (1986) (OCA 127/86, OCS 139/86), primer Doctorado en Ciencia de Materiales del país. Ambas carreras de
                posgrado tienen categoría "A", máxima calificación otorgada por la Comisión Nacional de Evaluación y
                Acreditación Universitaria (CONEAU) de Ministerio de Educación. Más adelante en 1989 se creó la carrera
                de grado en Ingeniería de Materiales con incumbencias profesionales reconocidas y el Magíster en
                Ingeniería Química. Actualmente otras instituciones del país como la Universidad de San Martín y CNEA
                (Instituto Sabato), Universidad Nacional de Comahue, Universidad Nacional de Río Cuarto e Instituto
                Balseiro, y Universidad Nacional de Sur (PROMAT) han creado carreras de grado y/o posgrado en el área de
                Ciencia e Ingeniería de Materiales..
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
