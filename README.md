# Next.js(13)으로 1:1 채팅 구현
## 시작
```
git clone https://github.com/janmki08/nextChat_test.git
cd nextChat_test
```
## v12-chat 브랜치
```
git checkout -b v12-chat origin/v12-chat
```
- 13버전은 기존의 socket.io가 작동하지 않음
- pages/api 경로를 사용해서 작동 확인
![image](https://github.com/user-attachments/assets/761a30e4-de15-427f-bbac-739cbded8c93)

## app/api 구조를 바꾸기 싫기도 하고, API 동작을 분리 시켜서 관리하고 싶음
- node.js
- express
