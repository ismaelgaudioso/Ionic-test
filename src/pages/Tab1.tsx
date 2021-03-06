import { useEffect, useState } from 'react';

import { IonModal, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, isPlatform, IonCardSubtitle, IonNote, IonFab, IonFabButton, IonIcon, IonBadge, IonRow, IonCol, IonButton } from '@ionic/react';
import { list } from 'ionicons/icons';

import { Map, Marker, Overlay } from "pigeon-maps";
import { maptiler } from 'pigeon-maps/providers';

import { MapOverlay } from '../components/MapOverlay';
import { CurrentPointOverlay } from '../components/CurrentPointOverlay';
import { ListModal } from '../components/ListModal';

import './Tab1.css';
import { getRecords } from '../data/data';
import RecordsStore from '../data/RecordsStore';
import { fetchRecords } from '../data/Selectors';




const maptilerProvider = maptiler('rQmJ3tL4fQSG3TUeAarU', 'streets');


const Tab1: React.FC = () => {

  const [currentPoint, setCurrentPoint] = useState({ latitude: 41.580833, longitude: -1.116111 });
  const [showCurrentPointInfo, setShowCurrentPointInfo] = useState(false);

  const records = RecordsStore.useState(fetchRecords);

  //const [markerPosition] = useState({ latitude: 41.578633, longitude: -1.114111 });
  const [results, setResults] = useState(records);

  const [showListModal, setShowListModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const web = isPlatform("desktop" || "pwa" || "mobileweb" || "");


  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event('resize'));
    getRecords(currentPoint);
  });

  useEffect(() => {
    setResults([...records]);
  }, [records]);


  const hideMarkers = () => {
    const tempRecords = JSON.parse(JSON.stringify(results));
    tempRecords.forEach((tempRecord: { showInfo: boolean; }) => tempRecord.showInfo = false);
    setResults(tempRecords);
    setShowCurrentPointInfo(false);
  }

  const showMarkerInfo = (e: any, index: any) => {

    const tempRecords = JSON.parse(JSON.stringify(records));

    setShowCurrentPointInfo(false);
    !tempRecords[index].showInfo && tempRecords.forEach((tempRecord: { showInfo: boolean; }) => tempRecord.showInfo = false);
    tempRecords[index].showInfo = !tempRecords[index].showInfo;

    setResults(tempRecords);

  }

  const handleShowCurrentPointInfo = () => {
    hideMarkers();
    setShowCurrentPointInfo(!showCurrentPointInfo);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {results &&
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Tab 1</IonTitle>
              </IonToolbar>
            </IonHeader>
            <div className="map-container">
              <Map
                attributionPrefix={false}
                defaultCenter={[currentPoint.latitude, currentPoint.longitude]}
                defaultZoom={16}
                minZoom={15}
                provider={maptilerProvider}
              >

                <Marker
                  onClick={handleShowCurrentPointInfo}
                  color="red"
                  width={50}
                  anchor={[currentPoint.latitude, currentPoint.longitude]}
                />
                {showCurrentPointInfo &&
                  <Overlay anchor={[currentPoint.latitude, currentPoint.longitude]} offset={[95, 140]}>
                    <CurrentPointOverlay />
                  </Overlay>
                }


                {results.map((record: any, index: any) => {

                  return <Marker
                    onClick={e => showMarkerInfo(e, index)}
                    key={index}
                    color="#3578e5"
                    width={40}
                    anchor={[record.latitude, record.longitude]} />

                })}

                {results.map((record: any, index: any) => {

                  if (record.showInfo) {
                    return (
                      <Overlay key={index} anchor={[record.latitude, record.longitude]} offset={[95, 210]}>
                        <MapOverlay record={record} />
                      </Overlay>
                    );
                  }
                })}







              </Map>

              <IonFab vertical="bottom" horizontal="start" slot="fixed" onClick={() => setShowListModal(!showListModal)}>
                <IonFabButton>
                  <IonIcon icon={list} />
                </IonFabButton>
              </IonFab>

              <IonModal
                isOpen={showListModal}
                onDidDismiss={() => setShowListModal(false)}
                swipeToClose={true}
                initialBreakpoint={0.6}
                breakpoints={[0, 0.6, 1]}
                backdropBreakpoint={0.6}
              >
                <ListModal
                  hideModal={() => setShowListModal(false)}
                  searchTerm={searchTerm}
                  search={setSearchTerm}
                  records={results}
                />
              </IonModal>
            </div>
          </>
        }
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
