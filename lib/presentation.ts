import geography from "./map-geography.json";
export const terrainAsset='/assets/'+geography.terrain;
// Visual descriptions only. These do not change production or victory rules.
export const landmarkNames=['풍요의 곡물 회관','북방의 산림 회관','열대의 커피 거래소','고산의 직물 회관','내륙의 제철 회관','극지의 기술 전당'];
export const landmarkDescriptions=['곡물 저장고와 교역 회관','침엽수림의 목재로 지은 회관','커피 재배와 가공 기술을 상징하는 교역 거점','고산 목축의 양털과 의류 산업을 상징하는 회관','건조한 내륙의 광물 자원과 제철 산업을 상징하는 회관','자동차 연구와 기술 투자를 상징하는 전당'];
// Percent coordinates on the original 1536 × 1024 terrain. Land-side buildings
// stay separate from the water-side ship endpoints in ports.json.
export const facilityPositions=geography.facilities;
export const harborPositions=geography.harbors;
export const warehousePositions=geography.warehouses;
export const landmarkPositions=geography.landmarks;
