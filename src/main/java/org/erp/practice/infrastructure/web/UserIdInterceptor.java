package org.erp.practice.infrastructure.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 모든 API 요청에서 X-User-Id 헤더를 읽어 request attribute에 저장.
 * 컨트롤러에서 (Long) request.getAttribute("userId") 로 꺼내 사용.
 */
@Component
public class UserIdInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        String header = request.getHeader("X-User-Id");
        if (header != null && !header.isBlank()) {
            try {
                request.setAttribute("userId", Long.parseLong(header));
            } catch (NumberFormatException ignored) {
            }
        }
        return true;
    }
}
