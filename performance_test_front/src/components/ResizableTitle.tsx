import React from 'react';
import { Resizable, type ResizeCallbackData } from 'react-resizable';

// 컴포넌트 속성 정의
interface ResizableTitleProps {
  width: number;
  onResize: (size: { width: number }) => void;
  children: React.ReactNode;
  // HTML th 태그에 전달될 나머지 속성을 허용합니다.
  [key: string]: any; 
}

const ResizableTitle: React.FC<ResizableTitleProps> = ({ 
  width, 
  onResize, 
  children, 
  style,
  ...restProps 
}) => {
  if (!width) {
    return <th {...restProps} style={style}>{children}</th>; // 💡 style을 적용
  }

  // 💡 타입스크립트 오류 해결: Event 매개변수에 any 타입 명시
  const handleResize = (_: any, { size }: ResizeCallbackData) => {
    onResize(size);
  };
  
  return (
    // Resizable 컴포넌트는 th를 감싸서 크기 조절 기능을 부여합니다.
    <Resizable
      width={width}
      height={0} // 높이 조절은 필요 없음
      onResize={handleResize}
      resizeHandles={['e']} // 동쪽(East) 방향, 즉 오른쪽 경계만 조절 가능
      // 마우스 오버 시 표시되는 핸들 스타일
      handle={<div style={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        width: '5px', 
        cursor: 'col-resize',
        backgroundColor: 'rgba(1, 8, 15, 0.4)', // 핸들 색상 표시
      }} />}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th 
        {...restProps} 
        style={{ 
          ...style, 
          width,
          position: 'sticky', // 👈 [필수 추가]
          zIndex: 1,         // 👈 [강화]
          // sticky를 사용하려면 top 값이 필요하지만, 여기서는 레이아웃 제어 목적으로만 사용합니다.
          // top: 0, 
        }}
      >
        {children}
      </th>
    </Resizable>
  );
};

export default ResizableTitle;